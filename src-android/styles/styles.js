import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    inputGroup: {
        flexDirection: 'row',
        margin: 10
    },
    formControl: {
        flex: 1,
        borderWidth: 1,
        height: 40,
        padding: 5
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10
      },
    item: {
        padding: 10,
        fontSize: 18,
        height: 80,
      },
    balloon: {
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 15,
        borderRadius: 20,
        marginBottom: 20
     },
    messageTxt: {
        color: 'white',
        fontSize: 16,
    },
    messageDate: {
        color: '#ccc',
        fontSize: 12,
    },
    safeArea: { flex: 1, backgroundColor: '#fff' }

});

// export default styles;