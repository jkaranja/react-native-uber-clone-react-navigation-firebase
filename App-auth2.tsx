//with protected routes:
//# we can conditionally define appropriate screens. For our case, let's say we have 3 screens:

// SplashScreen - This will show a splash or loading screen when we're restoring the token.
// SignInScreen - This is the screen we show if the user isn't signed in already (we couldn't find a token).
// HomeScreen - This is the screen we show if the user is already signed in.

//# Typically the flow will look like this:

// The user opens the app.
// The app loads some authentication state from encrypted persistent storage (for example, SecureStore).
// When the state has loaded, the user is presented with either authentication screens or the main app, depending on whether valid authentication state was loaded. when we press the hardware back button, we expect to not be able to go back to the authentication flow.
// When the user signs out, we clear the authentication state and send them back to authentication screens. 

/** 
if (state.isLoading) {
  // We haven't finished checking for the token yet
  return <SplashScreen />;
}

return (
  <Stack.Navigator>
    {state.userToken == null ? (
      // No token found, user isn't signed in
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: "Sign in",
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: state.isSignout ? "pop" : "push",
        }}
      />
    ) : (
      // User is signed in
      <Stack.Screen name="Home" component={HomeScreen} />
    )}
  </Stack.Navigator>
);

//oir 
https://reactnavigation.org/docs/auth-flow
*/