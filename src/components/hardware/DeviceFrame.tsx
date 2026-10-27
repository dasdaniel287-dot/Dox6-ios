import React from 'react';
import { DeviceColor, DeviceModel } from '../../types/ios';
import { soundManager } from '../../utils/audio';

interface DeviceFrameProps {
  deviceModel: DeviceModel;
  deviceColor: DeviceColor;
  isFlashlightOn: boolean;
  onPowerButton: () => void;
  onActionButton: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onHomeSwipe: () => void;
  onAppSwitcher: () => void;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  deviceModel,
  deviceColor,
  isFlashlightOn,
  onPowerButton,
  onActionButton,
  onVolumeUp,
  onVolumeDown,
  onHomeSwipe,
  onAppSwitcher,
  children,
}) => {
  // Titanium edge color mapping
  const getTitaniumFinish = () => {
    switch (deviceColor) {
      case 'black-titanium':
        return {
          frameBg: 'from-[#1c1b1e] via-[#2d2c30] to-[#141316]',
          border: 'border-[#3f3e42]',
          rim: 'ring-1 ring-[#525056]/30',
        };
      case 'desert-titanium':
        return {
          frameBg: 'from-[#423126] via-[#75553e] to-[#2c1f17]',
          border: 'border-[#8f6d54]',
          rim: 'ring-1 ring-[#bfa289]/40',
        };
      case 'white-titanium':
        return {
          frameBg: 'from-[#4a494d] via-[#78777d] to-[#38373b]',
          border: 'border-[#94939a]',
          rim: 'ring-1 ring-[#c5c4cb]/40',
        };
      case 'natural-titanium':
      default:
        return {
          frameBg: 'from-[#333236] via-[#525055] to-[#242327]',
          border: 'border-[#6e6c73]',
          rim: 'ring-1 ring-[#a3a1ab]/40',
        };
    }
  };

  const finish = getTitaniumFinish();

  // If responsive/fullscreen mode is chosen, omit device chassis
  if (deviceModel === 'responsive') {
    return (
      <div className="w-full h-screen relative bg-black overflow-hidden flex flex-col">
        {children}
        {/* Subtle bottom home bar */}
        <div
          onClick={onHomeSwipe}
          className="absolute bottom-2 inset-x-0 mx-auto w-36 h-1.5 bg-white/50 hover:bg-white/90 rounded-full cursor-pointer z-50 transition-colors"
        />
      </div>
    );
  }

  const isTablet = deviceModel === 'ipad-pro';
  const isProMax = deviceModel === 'iphone-16-promax';

  return (
    <div className="relative flex items-center justify-center p-2 sm:p-6 transition-all duration-300">
      {/* Torch Ambient Backlight Glow */}
      {isFlashlightOn && (
        <div className="absolute inset-0 bg-amber-400/25 blur-3xl rounded-[80px] pointer-events-none animate-pulse -z-10" />
      )}

      {/* Main Titanium Chassis */}
      <div
        className={`relative shadow-[0_25px_80px_rgba(0,0,0,0.85)] p-[12px] bg-gradient-to-b ${finish.frameBg} ${finish.border} ${finish.rim} transition-all duration-300`}
        style={{
          width: isTablet ? '840px' : isProMax ? '430px' : '400px',
          height: isTablet ? '680px' : isProMax ? '880px' : '820px',
          borderRadius: isTablet ? '44px' : '56px',
        }}
      >
        {/* Left Physical Buttons: Action Button & Volume */}
        {!isTablet && (
          <div className="absolute -left-[14px] top-28 flex flex-col gap-5 z-0">
            {/* Action Button */}
            <button
              onClick={() => {
                soundManager.playKeyClick();
                onActionButton();
              }}
              className="w-[4px] h-9 bg-neutral-600 hover:bg-amber-500 rounded-l-md transition-colors shadow-inner"
              title="Action Button (Custom Shortcut)"
            />
            {/* Volume Up */}
            <button
              onClick={() => {
                soundManager.playKeyClick();
                onVolumeUp();
              }}
              className="w-[4px] h-12 bg-neutral-600 hover:bg-neutral-400 rounded-l-md transition-colors shadow-inner"
              title="Volume Up"
            />
            {/* Volume Down */}
            <button
              onClick={() => {
                soundManager.playKeyClick();
                onVolumeDown();
              }}
              className="w-[4px] h-12 bg-neutral-600 hover:bg-neutral-400 rounded-l-md transition-colors shadow-inner"
              title="Volume Down"
            />
          </div>
        )}

        {/* Right Physical Button: Power / Side button */}
        {!isTablet && (
          <div className="absolute -right-[14px] top-36 z-0">
            <button
              onClick={() => {
                onPowerButton();
              }}
              className="w-[4px] h-16 bg-neutral-600 hover:bg-neutral-400 rounded-r-md transition-colors shadow-inner"
              title="Side / Power Button"
            />
          </div>
        )}

        {/* Inner OLED Display Glass */}
        <div
          className="relative w-full h-full bg-black overflow-hidden flex flex-col justify-between"
          style={{
            borderRadius: isTablet ? '34px' : '46px',
          }}
        >
          {children}

          {/* Interactive iOS Home Bar Indicator */}
          <div
            className="absolute bottom-1.5 inset-x-0 mx-auto w-36 h-4 flex items-center justify-center cursor-pointer z-50 group"
            onClick={onHomeSwipe}
            onDoubleClick={onAppSwitcher}
            title="Tap: Home | Double Tap: Multitasking"
          >
            <div className="w-32 h-1 bg-white/60 group-hover:bg-white group-hover:h-1.5 rounded-full transition-all duration-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
