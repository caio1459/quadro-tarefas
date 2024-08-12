import { useState } from "react";
import { ActivityIndicator, Alert, Image, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FirebaseService from "../../services/Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/rootStackParamList";

type LoginScreenNavigationProp = NavigationProp<RootStackParamList, 'Login'>

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('login');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>()
  const auth = FirebaseService.getInstance().getAuth()

  const imgLogin = require('../../../assets/images/login.png')
  const imgRegister = require('../../../assets/images/register.png')

  const handleLogin = async () => {
    if (handleCheck()) return
    setLoading(true)
    try {
      const userLoged = await signInWithEmailAndPassword(auth, email, password)
      navigation.navigate("Home", { userId: userLoged.user.uid, email: userLoged.user.email || '' })
    } catch (error) {
      Alert.alert('Opps...', `Erro ao logar: ${error}`)
      return
    } finally {
      reset()
    }
  }

  const handleRegister = async () => {
    if (handleCheck()) return
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      Alert.alert('Opps...', `Erro ao criar usuário: ${error}`)
      return
    } finally {
      reset()
    }
  }

  const reset = () => {
    setEmail('')
    setPassword('')
    setLoading(false)
    Keyboard.dismiss()
  }

  const handleCheck = (): boolean => {
    if (email === '' || password === '') {
      Alert.alert('Cadastro inválido', 'Os campos email e senha são obrigatórios')
      Keyboard.dismiss()
      return true
    }
    return false
  }

  const handleType = () => setType(type => type === 'login' ? 'cadastrar' : 'login')

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={{ width: '100%', height: '40%', resizeMode: 'contain' }}
        source={type === 'login' ? imgLogin : imgRegister}
      />
      {loading && <ActivityIndicator color={'blue'} size={50} />}
      <TextInput
        placeholder="Digite o seu e-mail"
        style={styles.input}
        value={email}
        onChangeText={(v) => setEmail(v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Digite a sua senha"
        style={styles.input}
        value={password}
        onChangeText={(v) => setPassword(v)}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <View style={styles.containerButtons}>
        {
          type === 'login'
            ? (
              <FontAwesome.Button name="unlock-alt" style={styles.button} onPress={handleLogin}>
                Logar
              </FontAwesome.Button>
            ) : (
              <FontAwesome.Button
                name="user" style={styles.button}
                backgroundColor={'#141414'}
                onPress={handleRegister}
              >
                Cadastrar
              </FontAwesome.Button>
            )
        }
        <TouchableOpacity style={styles.button} onPress={handleType}>
          <Text>
            {type === 'login' ? 'Criar uma conta' : 'Já possuo uma conta'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#F2f6fc'
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: '#141414'
  },
  containerButtons: {
    gap: 10
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45
  }
});
