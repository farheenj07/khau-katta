import { Router, Response } from 'express';
import {
  deliveries,
  orders,
  users,
  deliveryPartners,
  stalls,
  locationLogs,
  stepDeliverySimulation,
  updateDeliveryGps,
  onlineRiderIds,
  getOrCreateDeliveryOtp,
  deliveryVerifications,
  deliveryAssignmentAudits
} from '../data/db';
import { authenticate, requireAuth, AuthRequest } from '../middleware/auth';
import { Delivery, RoadRoute } from '../types';

const router = Router();

const ROUTE_REFRESH_MS = 12_000;
const ROUTE_MOVEMENT_THRESHOLD_DEGREES = 0.00025; // roughly 25 m in Belagavi
const roadRouteCache = new Map<string, { sourceLat: number; sourceLng: number; targetLat: number; targetLng: number; fetchedAt: number; route: RoadRoute }>();

function hasValidCoordinates(lat: number, lng: number) {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

async function getRoadRoute(delivery: Delivery): Promise<{ route?: RoadRoute; error?: string }> {
  const onCustomerLeg = ['picked_up', 'out_for_delivery', 'arrived_at_customer'].includes(delivery.status);
  const sourceLat = delivery.currentLat;
  const sourceLng = delivery.currentLng;
  const targetLat = onCustomerLeg ? delivery.destinationLat : delivery.stallLat;
  const targetLng = onCustomerLeg ? delivery.destinationLng : delivery.stallLng;
  if (!hasValidCoordinates(sourceLat, sourceLng) || !hasValidCoordinates(targetLat, targetLng)) return { error: 'Road route temporarily unavailable: valid rider or destination GPS coordinates are missing.' };

  const cached = roadRouteCache.get(delivery.id);
  const sourceHasMoved = !cached || Math.abs(cached.sourceLat - sourceLat) > ROUTE_MOVEMENT_THRESHOLD_DEGREES || Math.abs(cached.sourceLng - sourceLng) > ROUTE_MOVEMENT_THRESHOLD_DEGREES;
  const targetChanged = !cached || cached.targetLat !== targetLat || cached.targetLng !== targetLng;
  if (cached && !sourceHasMoved && !targetChanged && Date.now() - cached.fetchedAt < ROUTE_REFRESH_MS) return { route: cached.route };

  const baseUrl = (process.env.ROUTING_BASE_URL || 'https://router.project-osrm.org').replace(/\/$/, '');
  const url = `${baseUrl}/route/v1/driving/${sourceLng},${sourceLat};${targetLng},${targetLat}?overview=full&geometries=geojson`;
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`OSRM responded with ${response.status}`);
    const payload = await response.json() as { code?: string; routes?: Array<{ distance?: number; duration?: number; geometry?: { coordinates?: unknown } }> };
    const osrmRoute = payload.routes?.[0];
    const coordinates = osrmRoute?.geometry?.coordinates;
    if (payload.code !== 'Ok' || !osrmRoute || !Array.isArray(coordinates) || coordinates.length < 2 || typeof osrmRoute.distance !== 'number' || typeof osrmRoute.duration !== 'number') throw new Error('OSRM returned no usable driving route');
    const geometry = coordinates.filter((point): point is [number, number] => Array.isArray(point) && typeof point[0] === 'number' && typeof point[1] === 'number').map(([lng, lat]) => ({ lat, lng }));
    if (geometry.length < 2) throw new Error('OSRM returned invalid road geometry');
    const route: RoadRoute = { geometry, distanceKm: Number((osrmRoute.distance / 1000).toFixed(2)), durationMins: Math.max(1, Math.ceil(osrmRoute.duration / 60)), provider: 'OSRM', roadBased: true };
    roadRouteCache.set(delivery.id, { sourceLat, sourceLng, targetLat, targetLng, fetchedAt: Date.now(), route });
    return { route };
  } catch (error) {
    console.error(`Road routing failed for delivery ${delivery.id}:`, error);
    return { error: 'Road route temporarily unavailable.' };
  }
}

function canViewDelivery(req: AuthRequest, delivery: Delivery) {
  const order = orders.find(item => item.id === delivery.orderId);
  return req.user?.roleName === 'admin' || (req.user?.roleName === 'customer' && order?.userId === req.user.id) || (req.user?.roleName === 'delivery_partner' && delivery.partnerId === req.user.id) || (req.user?.roleName === 'stall_owner' && stalls.some(stall => stall.id === delivery.stallId && stall.ownerUserId === req.user!.id));
}

function activeDeliveryForRider(riderId: string) {
  return deliveries.find(item => item.partnerId === riderId && !['delivered', 'cancelled'].includes(item.status));
}

router.get('/admin/assignments', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  if (req.user!.roleName !== 'admin') return res.status(403).json({ success: false, message: 'Only admins can assign riders.' });
  const availableRiders = users
    .filter(user => {
      const profile = deliveryPartners.find(partner => partner.userId === user.id);
      return user.roleId === 'role-deliv-003' && user.status === 'active' && profile?.status === 'approved' && profile.isAvailable && onlineRiderIds.has(user.id) && !activeDeliveryForRider(user.id);
    })
    .map(user => {
      const profile = deliveryPartners.find(partner => partner.userId === user.id)!;
      return { id: user.id, name: user.name, phone: user.phone, rating: profile.rating, vehicle: `${profile.vehicleType} ${profile.vehicleNumber}` };
    });
  const assignmentOrders = orders.filter(order => !['delivered', 'cancelled'].includes(order.status)).map(order => ({
    ...order,
    stallName: stalls.find(stall => stall.id === order.stallId)?.name,
    customerName: users.find(user => user.id === order.userId)?.name,
    deliveryAddress: order.deliveryAddress || 'Saved customer address',
    delivery: deliveries.find(item => item.orderId === order.id)
  }));
  return res.json({ success: true, availableRiders, data: assignmentOrders });
});

router.post('/admin/assign', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  if (req.user!.roleName !== 'admin') return res.status(403).json({ success: false, message: 'Only admins can assign riders.' });
  const { orderId, riderId } = req.body || {};
  const order = orders.find(item => item.id === orderId);
  const delivery = deliveries.find(item => item.orderId === orderId);
  const rider = users.find(user => user.id === riderId && user.roleId === 'role-deliv-003' && user.status === 'active');
  const riderProfile = deliveryPartners.find(partner => partner.userId === riderId && partner.status === 'approved' && partner.isAvailable);
  if (!order || !delivery) return res.status(404).json({ success: false, message: 'Order delivery assignment not found.' });
  if (!rider || !riderProfile || !onlineRiderIds.has(rider.id)) return res.status(400).json({ success: false, message: 'Rider is not available.' });
  // A picked-up delivery must never be reassigned: the assigned rider is now
  // accountable for the order and delivery OTP.
  if (delivery && ['picked_up', 'out_for_delivery', 'arrived_at_customer'].includes(delivery.status)) {
    return res.status(409).json({ success: false, message: 'A picked-up delivery cannot be reassigned.' });
  }
  const occupied = activeDeliveryForRider(rider.id);
  if (occupied && occupied.id !== delivery.id) return res.status(409).json({ success: false, message: 'Rider already has an active delivery.' });
  const previousRiderId = delivery.partnerId;
  deliveryAssignmentAudits.push({
    id: `assignment-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    orderId,
    previousRiderId,
    nextRiderId: rider.id,
    assignedByUserId: req.user!.id,
    action: previousRiderId && previousRiderId !== rider.id ? 'REASSIGNED' : 'ASSIGNED',
    timestamp: new Date().toISOString()
  });
  delivery.partnerId = rider.id;
  delivery.partnerName = rider.name;
  delivery.partnerPhone = rider.phone;
  delivery.partnerVehicleNumber = riderProfile.vehicleNumber;
  delivery.status = 'assigned';
  delivery.assignedAt = new Date().toISOString();
  delivery.lastUpdated = delivery.assignedAt;
  order.deliveryPartnerId = rider.id;
  order.deliveryPartnerName = rider.name;
  order.deliveryPartnerPhone = rider.phone;
  order.status = 'rider_assigned';
  order.updatedAt = delivery.assignedAt;
  order.statusHistory = [...(order.statusHistory || []), { status: 'rider_assigned', timestamp: order.updatedAt }];
  return res.json({ success: true, message: `Delivery assigned to ${rider.name}.`, data: delivery });
});

router.post('/:id/decline', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const delivery = deliveries.find(item => item.id === req.params.id || item.orderId === req.params.id);
  if (!delivery || req.user!.roleName !== 'delivery_partner' || delivery.partnerId !== req.user!.id) {
    return res.status(403).json({ success: false, message: 'Only the assigned rider can decline this delivery.' });
  }
  if (delivery.status !== 'assigned') return res.status(409).json({ success: false, message: 'Only a new assignment can be declined.' });

  deliveryAssignmentAudits.push({
    id: `assignment-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    orderId: delivery.orderId,
    previousRiderId: req.user!.id,
    assignedByUserId: req.user!.id,
    action: 'DECLINED',
    timestamp: new Date().toISOString()
  });
  delivery.partnerId = undefined;
  delivery.partnerName = undefined;
  delivery.partnerPhone = undefined;
  delivery.partnerVehicleNumber = undefined;
  delivery.status = 'unassigned';
  delivery.lastUpdated = new Date().toISOString();
  const order = orders.find(item => item.id === delivery.orderId);
  if (order) {
    order.deliveryPartnerId = undefined;
    order.deliveryPartnerName = undefined;
    order.deliveryPartnerPhone = undefined;
    order.status = 'ready_for_pickup';
    order.updatedAt = delivery.lastUpdated;
    order.statusHistory = [...(order.statusHistory || []), { status: 'ready_for_pickup', timestamp: order.updatedAt }];
  }
  return res.json({ success: true, message: 'Delivery declined and returned to the assignment queue.', data: delivery });
});

router.post('/presence', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  if (req.user!.roleName !== 'delivery_partner') return res.status(403).json({ success: false, message: 'Only riders can update presence.' });
  if (req.body?.online) onlineRiderIds.add(req.user!.id); else onlineRiderIds.delete(req.user!.id);
  return res.json({ success: true, online: onlineRiderIds.has(req.user!.id) });
});

// ---------------------------------------------------------------------------
// 1. GET /api/deliveries/admin/live-fleet - Admin Live Fleet Monitoring
// ---------------------------------------------------------------------------
router.get('/admin/live-fleet', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  if (req.user!.roleName !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only admins can view the live delivery fleet.' });
  }
  const activeFleet = deliveries.filter(d => !['delivered', 'cancelled'].includes(d.status)).map(d => ({
    id: d.id,
    orderId: d.orderId,
    orderNumber: d.orderNumber,
    partnerId: d.partnerId,
    partnerName: d.partnerName,
    partnerPhone: d.partnerPhone,
    vehicleNumber: d.partnerVehicleNumber,
    currentLat: d.currentLat,
    currentLng: d.currentLng,
    speedKmh: d.speedKmh,
    headingDeg: d.headingDeg,
    status: d.status,
    simulationMode: d.simulationMode,
    stallName: d.stallName,
    customerName: d.customerName,
    destinationLat: d.destinationLat,
    destinationLng: d.destinationLng,
    deliveryAddress: d.deliveryAddress,
    remainingDistanceKm: Number((d.route.optimizedDistanceKm * (1 - d.simulationProgress)).toFixed(2)),
    remainingEtaMins: Math.max(1, Math.round(d.route.optimizedDurationMins * (1 - d.simulationProgress))),
    mlPrediction: d.mlPrediction,
    lastUpdated: d.lastUpdated
  }));

  res.json({
    success: true,
    totalRiders: activeFleet.length,
    activeDeliveriesCount: activeFleet.filter(f => f.status === 'out_for_delivery').length,
    data: activeFleet
  });
});

// ---------------------------------------------------------------------------
// 3. GET /api/deliveries/:id - Detailed Live Tracking Info
// ---------------------------------------------------------------------------
router.get('/:id/route', authenticate, async (req: AuthRequest, res: Response) => {
  const delivery = deliveries.find(d => d.id === req.params.id || d.orderId === req.params.id || d.orderNumber === req.params.id);
  if (!delivery) return res.status(404).json({ success: false, message: 'Delivery assignment not found.' });
  if (!req.user || !canViewDelivery(req, delivery)) return res.status(403).json({ success: false, message: 'You are not allowed to view this delivery.' });
  const result = await getRoadRoute(delivery);
  if (!result.route) return res.status(503).json({ success: false, message: result.error });
  return res.json({ success: true, data: result.route });
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const delivery = deliveries.find(d => d.id === id || d.orderId === id || d.orderNumber === id);

  if (!delivery) {
    return res.status(404).json({ success: false, message: 'Delivery assignment not found.' });
  }
  if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' });
  const order = orders.find(item => item.id === delivery.orderId);
  if (!canViewDelivery(req, delivery)) return res.status(403).json({ success: false, message: 'You are not allowed to view this delivery.' });
  const roadRouteResult = await getRoadRoute(delivery);

  res.json({
    success: true,
    data: {
      ...delivery,
      statusHistory: order?.statusHistory,
      roadRoute: roadRouteResult.route,
      routeError: roadRouteResult.error,
      remainingDistanceKm: roadRouteResult.route?.distanceKm,
      remainingDurationMins: roadRouteResult.route?.durationMins,
      lastUpdated: delivery.lastUpdated
    }
  });
});

// ---------------------------------------------------------------------------
// 2. POST /api/deliveries/:id/gps - Delivery Partner posts live GPS update
// ---------------------------------------------------------------------------
router.post('/:id/gps', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { latitude, longitude, accuracy, speed, heading } = req.body;
  const delivery = deliveries.find(item => item.id === id || item.orderId === id);

  if (!delivery) {
    return res.status(404).json({ success: false, message: 'Delivery tracking record not found.' });
  }
  if (req.user!.roleName !== 'delivery_partner' || delivery.partnerId !== req.user!.id) {
    return res.status(403).json({ success: false, message: 'Only the assigned rider can update this delivery location.' });
  }
  if (!['picked_up', 'out_for_delivery'].includes(delivery.status)) {
    return res.status(409).json({ success: false, message: 'Rider GPS starts after pickup verification.' });
  }

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid latitude and longitude coordinates.' });
  }

  const updated = updateDeliveryGps(id, latitude, longitude, speed, heading, typeof accuracy === 'number' ? accuracy : undefined);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Delivery tracking record not found.' });
  }

  res.json({
    success: true,
    message: 'Rider GPS location broadcast updated successfully.',
    data: updated
  });
});

router.patch('/:id/status', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const delivery = deliveries.find(item => item.id === req.params.id || item.orderId === req.params.id);
  if (!delivery) return res.status(404).json({ success: false, message: 'Delivery assignment not found.' });
  if (req.user!.roleName !== 'delivery_partner' || delivery.partnerId !== req.user!.id) {
    return res.status(403).json({ success: false, message: 'Only the assigned rider can update delivery status.' });
  }

  const nextStatus = req.body?.status;
  const validTransition = (delivery.status === 'assigned' && nextStatus === 'accepted') ||
    (delivery.status === 'accepted' && nextStatus === 'arrived_at_vendor') ||
    (['pickup_verified', 'picked_up'].includes(delivery.status) && nextStatus === 'out_for_delivery') ||
    (delivery.status === 'out_for_delivery' && nextStatus === 'arrived_at_customer');
  if (!validTransition) {
    return res.status(409).json({ success: false, message: 'Delivery status transition is not allowed.' });
  }

  delivery.status = nextStatus;
  delivery.lastUpdated = new Date().toISOString();
  if (nextStatus === 'arrived_at_customer') getOrCreateDeliveryOtp(delivery.orderId);
  const order = orders.find(item => item.id === delivery.orderId);
  if (order) {
    const orderStatus = nextStatus === 'accepted'
      ? 'rider_assigned'
      : nextStatus === 'arrived_at_vendor'
      ? 'rider_arrived_at_vendor'
      : nextStatus;
    order.status = orderStatus;
    order.updatedAt = delivery.lastUpdated;
    order.statusHistory = [...(order.statusHistory || []), { status: orderStatus, timestamp: order.updatedAt }];
  }
  return res.json({ success: true, message: `Delivery marked ${nextStatus.replace('_', ' ')}.`, data: delivery });
});

router.post('/:id/delivery-otp/verify', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const delivery = deliveries.find(item => item.id === req.params.id || item.orderId === req.params.id);
  if (!delivery || delivery.partnerId !== req.user!.id || req.user!.roleName !== 'delivery_partner') return res.status(403).json({ success: false, message: 'Only the assigned rider can verify delivery.' });
  if (delivery.status !== 'arrived_at_customer') return res.status(409).json({ success: false, message: 'Rider must arrive at the customer first.' });
  const record = deliveryVerifications.get(delivery.orderId);
  const input = typeof req.body?.otp === 'string' ? req.body.otp : '';
  if (!record || record.expiresAt < Date.now()) return res.status(400).json({ success: false, message: 'This Delivery OTP has expired.' });
  if (record.isVerified) return res.status(409).json({ success: false, message: 'This Delivery OTP has already been used.' });
  if (record.attempts >= 5) return res.status(429).json({ success: false, message: 'Maximum Delivery OTP attempts reached.' });
  if (!/^\d{6}$/.test(input) || input !== record.otpCode) {
    record.attempts += 1;
    return res.status(400).json({ success: false, message: 'Incorrect Delivery OTP. Please ask the customer to confirm the code.', attempts: record.attempts });
  }
  record.isVerified = true;
  record.verifiedAt = new Date().toISOString();
  record.verifiedByRiderId = req.user!.id;
  delivery.status = 'delivered';
  delivery.deliveredAt = record.verifiedAt;
  delivery.lastUpdated = record.verifiedAt;
  const order = orders.find(item => item.id === delivery.orderId);
  if (order) {
    order.status = 'delivered';
    order.updatedAt = record.verifiedAt!;
    order.statusHistory = [...(order.statusHistory || []), { status: 'delivered', timestamp: order.updatedAt }];
  }
  return res.json({ success: true, message: 'Delivery verified and order marked delivered.', data: delivery });
});

// ---------------------------------------------------------------------------
// 3. POST /api/deliveries/:id/simulation/step - Advance simulation progress (Demo Mode)
// ---------------------------------------------------------------------------
router.post('/:id/simulation/step', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const delivery = deliveries.find(item => item.id === req.params.id || item.orderId === req.params.id);
  const canSimulate = delivery && (req.user!.roleName === 'admin' ||
    (req.user!.roleName === 'delivery_partner' && delivery.partnerId === req.user!.id) ||
    (req.user!.roleName === 'customer' && delivery.customerUserId === req.user!.id));
  if (!canSimulate) {
    return res.status(403).json({ success: false, message: 'Only an authorized delivery participant can run this simulation.' });
  }
  const { id } = req.params;
  const updated = stepDeliverySimulation(id);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Delivery assignment not found.' });
  }

  res.json({
    success: true,
    message: 'Simulation step advanced.',
    data: updated
  });
});

// ---------------------------------------------------------------------------
// 4. POST /api/deliveries/:id/simulation/toggle - Toggle Live GPS vs Simulation
// ---------------------------------------------------------------------------
router.post('/:id/simulation/toggle', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const delivery = deliveries.find(d => d.id === id || d.orderId === id);

  if (!delivery) {
    return res.status(404).json({ success: false, message: 'Delivery assignment not found.' });
  }
  const canToggle = req.user!.roleName === 'admin' ||
    (req.user!.roleName === 'delivery_partner' && delivery.partnerId === req.user!.id) ||
    (req.user!.roleName === 'customer' && delivery.customerUserId === req.user!.id);
  if (!canToggle) return res.status(403).json({ success: false, message: 'You are not allowed to change this tracking mode.' });

  delivery.simulationMode = !delivery.simulationMode;
  delivery.lastUpdated = new Date().toISOString();

  res.json({
    success: true,
    message: `Tracking mode changed to ${delivery.simulationMode ? 'Simulation Demo Mode' : 'Live Physical GPS'}.`,
    data: delivery
  });
});

export default router;
