package com.nextferry;

import com.facebook.react.ReactActivity;
import com.reactnativenavigation.activities.RootActivity;
import com.reactnativenavigation.packages.RnnPackage;
//import com.AirMaps.AirPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends RootActivity {

    // /**
    //  * Returns the name of the main component registered from JavaScript.
    //  * This is used to schedule rendering of the component.
    //  */
    // @Override
    // protected String getMainComponentName() {
    //     return "NextFerry";
    // }

    // /**
    //  * Returns whether dev mode should be enabled.
    //  * This enables e.g. the dev menu.
    //  */
    // @Override
    // protected boolean getUseDeveloperSupport() {
    //     return BuildConfig.DEBUG;
    // }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    public List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RnnPackage(),
            //new AirPackage(),
            new MapsPackage()
        );
    }
}
