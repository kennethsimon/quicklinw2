# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:


-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Retain class members annotated with @Keep
-keepclassmembers class * {
    @androidx.annotation.Keep *;
}

# Keep React Native classes
-keep class com.facebook.react.** { *; }

# Keep Flipper classes
-keep class com.facebook.flipper.** { *; }

# Keep DevSupport classes
-keep class com.facebook.react.devsupport.** { *; }

# Retain all fields in all classes
-keepclassmembers class * {
    public <fields>;
}

# Retain all methods and constructors in all classes
-keepclassmembers class * {
    public <methods>;
}