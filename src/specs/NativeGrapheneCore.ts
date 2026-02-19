import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // 1. Get current battery level (0.0 to 1.0)
  getBatteryLevel(): Promise<number>;
  
  // 2. Get thermal state string ("nominal", "fair", "serious", "critical")
  getThermalState(): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('GrapheneCore');

//generates NativeGrapheneCoreSpec.h which holds C++ HostObject 