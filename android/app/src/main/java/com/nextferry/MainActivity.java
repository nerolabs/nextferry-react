package com.nextferry;

import com.reactnativenavigation.activities.RootActivity;
import com.reactnativenavigation.packages.RnnPackage;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

//Map module
import com.airbnb.android.react.maps.MapsPackage;



import java.util.Arrays;
import java.util.List;

public class MainActivity extends RootActivity {

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    public List<ReactPackage> getPackages() {
        return Arrays.asList(
                new MainReactPackage(),
                new RnnPackage(),
                new MapsPackage()
        );
    }
}
