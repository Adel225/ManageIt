import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const ListHeading = ({ title }: ListHeadingProps) => {
    const router = useRouter();
    return (
        <View className='list-head '>
            <Text className='list-title'>{title}</Text>

            <TouchableOpacity onPress={() => router.push("/(tabs)/subscriptions")} className='list-action'>
                <Text className='list-action-text'>View All</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ListHeading