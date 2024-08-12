import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../types/rootStackParamList";
import { RouteProp, StackActions, useNavigation, useRoute } from "@react-navigation/native";
import { Task } from "../../components/Task";
import { ITask } from "../../interfaces/ITask";
import FirebaseService from "../../services/Firebase";
import { get, push, ref, remove, set, update } from "firebase/database";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>

export const Home = () => {
  const [task, setTask] = useState('')
  const [key, setKey] = useState<string | null>('');
  const [tasks, setTasks] = useState<ITask[]>([])
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation()
  const database = FirebaseService.getInstance().getDatabase()
  const route = useRoute<HomeScreenRouteProp>()
  const { userId, email } = route.params
  const inputRef = useRef<TextInput>(null)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: email ? `Bem-vindo: ${email}` : 'Quadro de Tarefas'
    })
  }, [])

  useEffect(() => {
    if (!userId) {
      navigation.dispatch(StackActions.popToTop())
      return
    }
    handleGet()
  }, [userId]);

  const handleGet = async () => {
    try {
      const loadTasks: ITask[] = []
      const dataRef = ref(database, `tasks/${userId}`)
      const snapshot = await get(dataRef);
      if (snapshot.exists()) {
        snapshot.forEach((value) => {
          loadTasks.push({ id: value.key, ...value.val() })
        })
      }
      setTasks(loadTasks)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (task === '') return
    try {
      if (key === '') {
        const newTask: ITask = {
          description: task,
          id: null
        }
        // Referência ao nó "tasks" com o ID do usuário
        const taskRef = ref(database, `tasks/${userId}`)
        // Gera uma nova chave única e referencia o local onde a tarefa será salva
        const newTaskRef = push(taskRef);
        await set(newTaskRef, newTask)
        //Pega o tarafa que acabou de ser criada
        const data: ITask = {
          id: newTaskRef.key,
          description: task
        }
        //Adiona novos dados na lista com base na lista antiga
        setTasks(oldTasks => [...oldTasks, data])
      } else {
        const taskRef = ref(database, `tasks/${userId}/${key}`)
        await update(taskRef, {
          description: task
        })
        //Busca a posição do objeto na lista de acordo com o id
        const taskIndex = tasks.findIndex(item => item.id === key)
        //Cria uma nova lista com base na lista atual
        let newTask = tasks
        //Altera somente o item da lista que possui o index que foi editado
        newTask[taskIndex].description = task
        //Adiciona apenas o que foi alterado no array
        setTasks([...newTask])
      }
    } catch (error) {
      Alert.alert(`Erro ao criar tarefa: ${error}`)
    } finally {
      reset()
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const taskRef = ref(database, `tasks/${userId}/${id}`)
      await remove(taskRef)
      //Cria um novo array removendo o item clicado da lista
      const newTasks = tasks.filter((item => item.id !== id))
      setTasks(newTasks)
    } catch (error) {
      Alert.alert(`Erro ao deletar tarefa: ${error}`)
    }
  }

  const confirmDelete = (id: string) => {
    Alert.alert("Atenção", "Confirma deletar está tarefa?", [
      { text: 'Cancelar', onPress: () => { } },
      { text: 'OK', onPress: () => handleDelete(id) }
    ])
  }

  const handleEdit = async (task: ITask) => {
    setTask(task.description)
    if (task !== null) {
      setKey(task.id)
    }
    inputRef.current?.focus()
  }

  const reset = () => {
    setTask('')
    setKey('')
    Keyboard.dismiss()
  }

  return (
    <SafeAreaView style={styles.container}>
      {
        loading ? (
          <ActivityIndicator size={25} color={'blue'} />
        ) : (
          <>
            {
              key ? (
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <TouchableOpacity onPress={reset}>
                    <Feather size={20} name="x-circle" color={"#ff0000"} />
                  </TouchableOpacity>
                  <Text style={{ marginLeft: 5, color: '#ff0000' }}>
                    Você está editando uma tarefa!
                  </Text>
                </View>
              ) : (
                <></>
              )
            }

            <View style={styles.containerTask}>
              <TextInput
                placeholder="Criar Tarefa"
                style={styles.input}
                value={task}
                onChangeText={(v) => setTask(v)}
                ref={inputRef}
              />
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                {
                  key ? (
                    <MaterialIcons name="edit" size={24} color="#fff" />
                  ) : (
                    <FontAwesome6 name="add" size={24} color="#fff" />
                  )
                }
              </TouchableOpacity>
            </View>
            <FlatList
              data={tasks}
              keyExtractor={item => item.id || ''}
              renderItem={({ item }) => (
                <Task task={item} handleDelete={confirmDelete} handleEdit={handleEdit} />
              )} />
          </>
        )
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: '#F2f6fc'
  },
  containerTask: {
    flexDirection: 'row',
    gap: 8
  },
  input: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#141414',
    height: 45
  },
  button: {
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    paddingHorizontal: 14,
  },
});
