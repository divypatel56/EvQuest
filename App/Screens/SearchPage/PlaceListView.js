//PlaceListView.js

// -------------------------- Imports --------------------------
// Core React and React Native components
import { View, Text, FlatList, Dimensions, StyleSheet } from 'react-native'
import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
//Screen
import PlaceItem from './PlaceItem';

// -------------------------- Constants --------------------------

const { width: SCREEN_WIDTH } = Dimensions.get('window'); // Get screen width

// -------------------------- PlaceListView Component -------------------------
/**
 * This component renders a horizontal, paginated list of places.
 * It takes in a list of places and renders each one using the PlaceItem component.
 * It exposes a `scrollToIndex` method to allow external scrolling.
 */
const PlaceListView = forwardRef(({ placeList = [] }, ref) => {
    const flatListRef = useRef(null);

    // Scroll to the first item when the placeList changes
    useEffect(() => {
        if (placeList.length > 0) {
            scrollToIndex(0);
        }
    }, [placeList]);

    // Function to scroll to a specific index
    const scrollToIndex = (index) => {
        flatListRef.current?.scrollToIndex({ animated: true, index });
    };

    // Expose scrollToIndex to the parent using ref
    useImperativeHandle(ref, () => ({
        scrollToIndex,
    }));

    // Calculate layout for FlatList items to support horizontal scrolling
    const getItemLayout = (_, index) => ({
        length: SCREEN_WIDTH,
        offset: SCREEN_WIDTH * index,
        index,
    });

    // -------------------------- UI Rendering --------------------------

    return (
        <View style={styles.container}>
            <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                ref={flatListRef}
                getItemLayout={getItemLayout}
                data={placeList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View key={index}>
                        <PlaceItem place={item} />
                    </View>
                )}
            />
        </View>
    );
});

export default PlaceListView;

// -------------------------- Styles --------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});