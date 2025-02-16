import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, Text, View, SafeAreaView, Image, ScrollView, Alert, Modal, Button, TouchableHighlight } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector } from 'react-redux';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import Card from '../../components/UI/Card';

const UserInformationScreen = (props) => {
  const userInfo = useSelector((state) => state.user.user);
  // const [modalVisible, setModalVisible] = useState(true);

  const { firstName, lastName, email, phone, address, profileUrl, description } = userInfo;

  if (!profileUrl) {
    return (
      <View style={styles.centeredView}>
        <Card>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Welcome here!</Text>
            <Button
              color={Colors.primary}
              title="Click to add your information"
              onPress={() => {
                props.navigation.navigate('EditUserInfo');
              }}
            />
          </View>
        </Card>
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignSelf: 'center', paddingTop: 16 }}>
          <View style={styles.profileImage}>
            <Image source={profileUrl.trim() !== '' ? { uri: profileUrl } : require('../../assets/alex.jpeg')} style={styles.image} resizeMode="center" />
          </View>
          <View style={styles.dm}>
            <MaterialIcons name="chat" size={18} color="#DFD8C8" />
          </View>
          <View style={styles.active} />
          <View style={styles.add}>
            <Ionicons name="ios-add" size={45} color="#DFD8C8" style={{ marginTop: 2, marginLeft: 2 }} />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.text, { fontWeight: '200', fontSize: 36 }]}>{firstName}{' '}{lastName}</Text>
          <Text style={[styles.text, { color: '#AEB5BC', fontSize: 14 }]}>Phone: {phone}</Text>
          <Text style={[styles.text, { color: '#AEB5BC', fontSize: 14 }]}>{email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsBox}>
            <Text style={[styles.text, { fontSize: 24 }]}>483</Text>
            <Text style={[styles.text, styles.subText]}>Posts</Text>
          </View>
          <View style={[styles.statsBox, { borderColor: '#DFD8C8', borderLeftWidth: 1, borderRightWidth: 1 }]}>
            <Text style={[styles.text, { fontSize: 24 }]}>45,844</Text>
            <Text style={[styles.text, styles.subText]}>Followers</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={[styles.text, { fontSize: 24 }]}>302</Text>
            <Text style={[styles.text, styles.subText]}>Following</Text>
          </View>
        </View>

        <View style={{ marginTop: 32 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.mediaImageContainer}>
              <Image source={require('../../assets/media1.jpg')} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.mediaImageContainer}>
              <Image source={require('../../assets/media2.jpg')} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.mediaImageContainer}>
              <Image source={require('../../assets/media3.jpg')} style={styles.image} resizeMode="cover" />
            </View>
          </ScrollView>
        </View>
        <Text style={[styles.subText, styles.recent]}>Recent Activity</Text>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.recentItem}>
            <View style={styles.activityIndicator} />
            <View style={{ width: 250 }}>
              <Text style={[styles.text, { color: '#41444B', fontWeight: '300' }]}>
                Address: {address}
              </Text>
            </View>
          </View>

          <View style={styles.recentItem}>
            <View style={styles.activityIndicator} />
            <View style={{ width: 250 }}>
              <Text style={[styles.text, { color: '#41444B', fontWeight: '300' }]}>
                Description: {description}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  text: {
    fontFamily: 'open-sans-bold',
    color: '#52575D'
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16
  },
  subText: {
    fontSize: 12,
    color: '#AEB5BC',
    textTransform: 'uppercase',
    fontWeight: '500'
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: Colors.dark_gray,
    borderWidth: 3,
    backgroundColor: 'transparent',
    overflow: 'hidden'
  },
  dm: {
    backgroundColor: '#41444B',
    position: 'absolute',
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  active: {
    backgroundColor: '#34FFB9',
    position: 'absolute',
    bottom: 34,
    left: 10,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 10
  },
  add: {
    backgroundColor: '#41444B',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 16
  },
  statsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 32
  },
  statsBox: {
    alignItems: 'center',
    flex: 1
  },
  mediaImageContainer: {
    width: 180,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10
  },
  mediaCount: {
    backgroundColor: '#41444B',
    position: 'absolute',
    top: '50%',
    marginTop: -50,
    marginLeft: 30,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.38)',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 1
  },
  recent: {
    marginLeft: 78,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 10
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  activityIndicator: {
    backgroundColor: '#CABFAB',
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 20
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  }
});

UserInformationScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Your Info',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer('UserInfo');
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
            navData.navigation.navigate('EditUserInfo');
          }}
        />
      </HeaderButtons>
    ),
  };
};
export default UserInformationScreen;
