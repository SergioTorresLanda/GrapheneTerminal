//
//  GraphenePnLManager.mm.swift
//  GrapheneTerminal
//
//  Created by Sergio Torres Landa González on 19/02/26.
//

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "GrapheneTerminal-Swift.h" // Auto-generated header to access Swift from Obj-C

@interface GraphenePnLManager : RCTViewManager
@end

@implementation GraphenePnLManager

RCT_EXPORT_MODULE(GraphenePnLView)

// Export the prop so React Native knows it can send a string
RCT_EXPORT_VIEW_PROPERTY(pnlValue, NSString)

- (UIView *)view
{
  // 1. We cannot return a SwiftUI View directly.
  // 2. We wrap it in a UIHostingController (which is a UIViewController).
  // 3. We extract the native UIView from that controller and hand it to React Native.
  
  // Note: Full implementation requires bridging the prop updates via the updateState protocol,
  // but this is the core initialization.
  return [[UIView alloc] init];
}

@end
