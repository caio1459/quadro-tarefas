import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Login } from "../pages/Login"
import { Home } from "../pages/Home"

export const Routes = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerBackVisible: false,
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          },
        }}
      />
    </Stack.Navigator>
  )
}