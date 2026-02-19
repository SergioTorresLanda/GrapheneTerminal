package com.grapheneterminal.modules

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class GrapheneCorePackage : TurboReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == "GrapheneCore") {
            GrapheneCoreModule(reactContext)
        } else {
            null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
            moduleInfos["GrapheneCore"] = ReactModuleInfo(
                "GrapheneCore",
                "GrapheneCore",
                false, // canOverrideExistingModule
                false, // needsEagerInit
                true,  // hasConstants
                false, // isCxxModule
                true   // isTurboModule
            )
            moduleInfos
        }
    }
}