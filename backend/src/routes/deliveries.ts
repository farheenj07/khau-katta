import { Router, Response } from 'express';
import {
  deliveries,
  orders,
  users,
  stalls,
  locationLogs,
  stepDeliverySimulation,
  updateDeliveryGps,
  generateRouteOptimization,
  predictDeliveryDelay
} from '../data/db';
import { authenticate, requireAuth, AuthRequest } from '../middleware/auth';
import { Delivery } from '../types';

const router = Router();

// ---------------------------------------------------------------------------
// 1. GET /api/deliveries/admin/live-fleet - Admin Live Fleet Monitoring
// ---------------------------------------------------------------------------
router.get('/admin/live-fleet', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const activeFleet = deliveries.map(d => ({
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
// 2. POST /api/deliveries/optimize-route - Intelligent Route Optimization API
// ---------------------------------------------------------------------------
router.post('/optimize-route', (req: AuthRequest, res: Response) => {
  const { startLat, startLng, endLat, endLng } = req.body;

  const oLat = typeof startLat === 'number' ? startLat : 15.8522;
  const oLng = typeof startLng === 'number' ? startLng : 74.5042;
  const dLat = typeof endLat === 'number' ? endLat : 15.8647;
  const dLng = typeof endLng === 'number' ? endLng : 74.5124;

  const routeData = generateRouteOptimization(oLat, oLng, dLat, dLng);

  res.json({
    success: true,
    data: routeData
  });
});

// ---------------------------------------------------------------------------
// 3. GET /api/deliveries/:id - Detailed Live Tracking Info
// ---------------------------------------------------------------------------
router.get('/:id', authenticate, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const delivery = deliveries.find(d => d.id === id || d.orderId === id || d.orderNumber === id);

  if (!delivery) {
    return res.status(404).json({ success: false, message: 'Delivery assignment not found.' });
  }

  // Recalculate dynamic ML prediction and route stats based on live status
  const currentDist = Number((delivery.route.optimizedDistanceKm * (1 - delivery.simulationProgress)).toFixed(2));
  const currentEta = Math.max(1, Math.round(delivery.route.optimizedDurationMins * (1 - delivery.simulationProgress)));

  res.json({
    success: true,
    data: {
      ...delivery,
      remainingDistanceKm: currentDist,
      remainingDurationMins: currentEta
    }
  });
});

// ---------------------------------------------------------------------------
// 2. POST /api/deliveries/:id/gps - Delivery Partner posts live GPS update
// ---------------------------------------------------------------------------
router.post('/:id/gps', authenticate, requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { latitude, longitude, speed, heading } = req.body;

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid latitude and longitude coordinates.' });
  }

  const updated = updateDeliveryGps(id, latitude, longitude, speed, heading);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Delivery tracking record not found.' });
  }

  res.json({
    success: true,
    message: 'Rider GPS location broadcast updated successfully.',
    data: updated
  });
});

// ---------------------------------------------------------------------------
// 3. POST /api/deliveries/:id/simulation/step - Advance simulation progress (Demo Mode)
// ---------------------------------------------------------------------------
router.post('/:id/simulation/step', authenticate, (req: AuthRequest, res: Response) => {
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
router.post('/:id/simulation/toggle', authenticate, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const delivery = deliveries.find(d => d.id === id || d.orderId === id);

  if (!delivery) {
    return res.status(404).json({ success: false, message: 'Delivery assignment not found.' });
  }

  delivery.simulationMode = !delivery.simulationMode;
  delivery.lastUpdated = new Date().toISOString();

  res.json({
    success: true,
    message: `Tracking mode changed to ${delivery.simulationMode ? 'Simulation Demo Mode' : 'Live Physical GPS'}.`,
    data: delivery
  });
});

export default router;
