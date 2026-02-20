import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type { HostComponent } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

// This defines the exact data we will pass from JS to Swift
export interface NativeProps extends ViewProps {
  pnlValue: string; 
}

export default codegenNativeComponent<NativeProps>('GraphenePnLView') as HostComponent<NativeProps>;