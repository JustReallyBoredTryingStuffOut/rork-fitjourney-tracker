/**
* This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
*
* Do not edit this file as changes may cause incorrect behavior and will be lost
* once the code is regenerated.
*
* @generated by codegen project: GeneratePropsJavaInterface.js
*/

package com.facebook.react.viewmanagers;

import android.view.View;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.uimanager.ViewManagerWithGeneratedInterface;

public interface RNSVGFeCompositeManagerInterface<T extends View> extends ViewManagerWithGeneratedInterface {
  void setX(T view, Dynamic value);
  void setY(T view, Dynamic value);
  void setWidth(T view, Dynamic value);
  void setHeight(T view, Dynamic value);
  void setResult(T view, @Nullable String value);
  void setIn1(T view, @Nullable String value);
  void setIn2(T view, @Nullable String value);
  void setOperator1(T view, @Nullable String value);
  void setK1(T view, float value);
  void setK2(T view, float value);
  void setK3(T view, float value);
  void setK4(T view, float value);
}
