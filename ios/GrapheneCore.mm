#import "GrapheneCore.h"
#import "GrapheneTerminal-Swift.h" // <--- The bridge to your Swift code

@implementation GrapheneCore

RCT_EXPORT_MODULE()

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeGrapheneCoreSpecJSI>(params);
}

// 1. Battery Level Implementation
- (void)getBatteryLevel:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  GrapheneCoreImpl *impl = [[GrapheneCoreImpl alloc] init];
  float level = [impl getBatteryLevel];
  // Convert -1.0 (simulator/unknown) to 0.0 for safety
  if (level < 0) level = 1.0; 
  resolve(@(level));
}

// 2. Thermal State Implementation
- (void)getThermalState:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  GrapheneCoreImpl *impl = [[GrapheneCoreImpl alloc] init];
  NSString *state = [impl getThermalState];
  resolve(state);
}

@end