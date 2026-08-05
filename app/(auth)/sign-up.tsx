import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const SignUP = () => {
    return (
        <View>
            <Text>Sign UP</Text>
            <Link className="mt-4 rounded bg-primary text-white p-4" href="/(auth)/sign-in" >Sign In </Link>
        </View>
    )
}

export default SignUP