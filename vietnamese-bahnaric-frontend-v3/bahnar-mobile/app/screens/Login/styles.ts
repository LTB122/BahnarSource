import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5FF',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
    backgroundColor: '#fff',
    width: 100,
    aspectRatio: 1,
  },
  logo: {
    width: 48,
    aspectRatio: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    zIndex: 3,
    elevation: 3,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    marginTop: 12,
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    paddingHorizontal: 40,
    paddingVertical: 52,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formTitle: {
    fontWeight: '700',
    fontSize: 24,
    marginLeft: 8,
    color: '#1D46F8',
  },
});
