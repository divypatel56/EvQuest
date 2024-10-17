import { View, Text, FlatList, Dimensions, StyleSheet } from 'react-native'
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import PlaceItem from './PlaceItem';

//get screen width
const { width: SCREEN_WIDTH } = Dimensions.get('window'); // Get screen width

const PlaceListView = forwardRef(({ placeList = [] }, ref) => {
    const flatListRef = useRef(null);

    useEffect(() => {
        if (placeList.length > 0) {
            scrollToIndex(0);
        }
    }, [placeList]);

    const scrollToIndex = (index) => {
        flatListRef.current?.scrollToIndex({ animated: true, index });
    };

    // Expose scrollToIndex to the parent using ref
    useImperativeHandle(ref, () => ({
        scrollToIndex,
    }));

    const getItemLayout = (_, index) => ({
        length: SCREEN_WIDTH,
        offset: SCREEN_WIDTH * index,
        index,
    });

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});