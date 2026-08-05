import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const SignIn = () => {
    return (
        <View>
            <Text>Sign In</Text>
            <Link className="mt-4 rounded bg-primary text-white p-4" href="/(auth)/sign-up" >Create an account</Link>
            <Link className="mt-4 rounded bg-primary text-white p-4" href="/(tabs)" >Go Home</Link>
        </View>
    )
}

export default SignIn