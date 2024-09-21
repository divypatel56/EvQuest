import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'



export default function SignUpScreen() {
    return (
        <View style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10
        }}>
            <Image source={require('./../../assets/Images/logo.png')} style={style.logoImage} />
            <Image source={require('./../../assets/Images/bg1.jpeg')} style={style.logoImage1} />

        </View>
    )
}
const style = StyleSheet.create({
    logoImage: {
        width: 120,
        height: 80,
        objectFit: 'contain'
    },
    bgImage: {
        width: '100%',
        height: 250,
        marginTop: 20,
        objectFit: 'cover'
    },
});