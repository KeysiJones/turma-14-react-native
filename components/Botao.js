import { Button, Pressable } from 'react-native';

export default function Botao(props) {
  return (
    <Pressable
      style={{
        backgroundColor: props.corDeFundo ? props.corDeFundo : 'green',
        display: 'flex',
        color: 'white',
        borderRadius: '6px',
        marginTop: 10,
      }}
    >
      <Button title={props.title} color='white' onPress={props.onPress}></Button>
    </Pressable>
  );
}
