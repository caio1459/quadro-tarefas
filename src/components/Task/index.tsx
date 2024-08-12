import { StyleSheet, Text, View } from "react-native"
import { ITask } from "../../interfaces/ITask"
import Entypo from '@expo/vector-icons/Entypo';

interface ITaskProps {
  task: ITask,
  handleDelete: (id: string) => void
  handleEdit: (task: ITask) => void
}

export const Task = ({ task, handleDelete, handleEdit }: ITaskProps) => {
  return (
    <View style={styles.container}>
      <Text style={{ color: '#fff', fontSize: 16 }} onPress={() => handleEdit(task)}>
        {task.description}
      </Text>
      <Entypo name="trash" size={24} color="#fff" onPress={() => handleDelete(task.id || '')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#121212',
    marginBottom: 10,
    padding: 10,
    borderRadius: 4
  }
})