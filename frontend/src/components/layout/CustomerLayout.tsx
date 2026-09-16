import React from 'react';
import { Outlet } from 'react-router-dom';
import { RoleSwitcherBar } from './RoleSwitcherBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { InstallPrompt } from './InstallPrompt';
import { LoginModal } from '../auth/LoginModal';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col theme-artisan-bg text-[#2e1b10] relative selection:bg-[#e28743]/30 selection:text-[#2e1b10]">
      {/* Ambient warm lighting & glow orbs matching Pinterest food app wireframe */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-28 -left-28 w-[32rem] h-[32rem] rounded-full bg-[#e28743]/14 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[34rem] h-[34rem] rounded-full bg-[#d47a3b]/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-[36rem] h-[36rem] rounded-full bg-[#eaa86e]/14 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen flex-1">
        <RoleSwitcherBar />
        <InstallPrompt />
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">
          <Outlet />
        </main>
        <Footer />
        <BottomNav />
        <LoginModal />
      </div>
    </div>
  );
};
