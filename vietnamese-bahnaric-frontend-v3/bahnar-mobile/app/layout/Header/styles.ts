import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    height: 83,
    width: '100%',
    position: 'relative',
  },
  innerHeader: {
    position: 'absolute',
    right: '25%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backgroundShape: {
    position: 'absolute',
    bottom: 0,
    left: '-75%',
    height: 500,
    width: '150%',
    borderRadius: 70,
    backgroundColor: '#1C45F9',
  },
  headerTail: {
    position: 'absolute',
    bottom: -52.75,
  },
  menuButton: {
    marginLeft: 44,
    marginTop: 16,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'BalooChettan2-Bold',
    textAlign: 'right',
  },
  iconBox: {
    width: 62,
    height: 62,
    transform: [{ translateX: 31 }],
  },
});
