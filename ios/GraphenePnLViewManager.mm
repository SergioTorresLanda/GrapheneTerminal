//
//  GraphenePnLViewManager.mm
//  GrapheneTerminal
//
//  Created by Sergio Torres Landa González on 19/02/26.
//

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>

// This is the auto-generated header that exposes all @objc Swift classes to Objective-C
// Replace "GrapheneTerminal" with your exact iOS project name if it differs
#import "GrapheneTerminal-Swift.h"

@interface GraphenePnLViewManager : RCTViewManager
@end

@implementation GraphenePnLViewManager

// 1. Expose the module to React Native. The string passed here must match
// the string in your JS codegenNativeComponent('GraphenePnLView')
RCT_EXPORT_MODULE(GraphenePnLView)

// 2. Expose the exact prop name so JS can map to the Swift property
RCT_EXPORT_VIEW_PROPERTY(pnlValue, NSString)

// 3. Instantiate and return the Swift View
- (UIView *)view
{
  return [[PnLHostingView alloc] init];
}

@end
