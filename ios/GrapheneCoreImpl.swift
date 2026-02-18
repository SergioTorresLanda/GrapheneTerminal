import Foundation
import UIKit

@objc(GrapheneCoreImpl)
public class GrapheneCoreImpl: NSObject {
  
  @objc
  public func getBatteryLevel() -> Float {
    UIDevice.current.isBatteryMonitoringEnabled = true
    return API_TO_BE_DEPRECATED_replaceWithRealImpl()
  }
  
  @objc
  public func getThermalState() -> String {
    let state = ProcessInfo.processInfo.thermalState
    switch state {
      case .nominal: return "nominal"
      case .fair: return "fair"
      case .serious: return "serious"
      case .critical: return "critical"
      @unknown default: return "unknown"
    }
  }

  private func API_TO_BE_DEPRECATED_replaceWithRealImpl() -> Float {
      return UIDevice.current.batteryLevel
  }
}