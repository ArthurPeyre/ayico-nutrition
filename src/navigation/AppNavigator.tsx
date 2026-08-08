import { useEffect, useRef } from "react";
import {
    Animated,
    Pressable,
    StyleSheet,
    View,
    useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    BottomTabBarProps,
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type AppTabParamList = {
    Home: undefined;
    Profil: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const INDICATOR_INSET = 6;
const ITEM_MAX_WIDTH = 104;
const HORIZONTAL_MARGIN = 24;

const ICONS: Record<
    keyof AppTabParamList,
    {
        active: keyof typeof Ionicons.glyphMap;
        inactive: keyof typeof Ionicons.glyphMap;
    }
> = {
    Home: { active: "home", inactive: "home-outline" },
    Profil: { active: "person", inactive: "person-outline" },
};
const ICON_SIZE = 24;

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { width: screenWidth } = useWindowDimensions();
    const translateX = useRef(new Animated.Value(0)).current;
    const scaleY = useRef(new Animated.Value(1)).current;

    const maxBarWidth = screenWidth - HORIZONTAL_MARGIN * 2;
    const barWidth = Math.min(
        maxBarWidth,
        state.routes.length * ITEM_MAX_WIDTH,
    );
    const itemWidth = barWidth / state.routes.length;
    const edgePadding = (itemWidth - ICON_SIZE) / 4;
    // Meme largeur partout (celle utilisee sur les bords) : plus large que
    // itemWidth - INDICATOR_INSET*2, donc il faut recentrer la position pour
    // les items du milieu qui eux n'ont pas de padding d'icone.
    const indicatorWidth = itemWidth + edgePadding - INDICATOR_INSET * 2;
    const maxIndicatorX = barWidth - indicatorWidth - INDICATOR_INSET;

    useEffect(() => {
        const isFirst = state.index === 0;
        const isLast = state.index === state.routes.length - 1;

        let targetX: number;
        if (isFirst) {
            targetX = INDICATOR_INSET;
        } else if (isLast) {
            targetX = maxIndicatorX;
        } else {
            // Centre l'indicateur (plus large) sur l'icone (non decalee).
            targetX = state.index * itemWidth + INDICATOR_INSET - edgePadding / 2;
        }

        Animated.parallel([
            Animated.spring(translateX, {
                toValue: targetX,
                useNativeDriver: true,
                bounciness: 4,
            }),
            Animated.sequence([
                Animated.timing(scaleY, {
                    toValue: 0.9,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleY, {
                    toValue: 1,
                    useNativeDriver: true,
                    bounciness: 16,
                }),
            ]),
        ]).start();
    }, [
        state.index,
        state.routes.length,
        itemWidth,
        edgePadding,
        maxIndicatorX,
        translateX,
        scaleY,
    ]);

    return (
        <View style={styles.positioner}>
            <View style={[styles.shadowWrapper, { width: barWidth }]}>
                <View style={styles.bar}>
                    <Animated.View
                        style={[
                            styles.indicator,
                            {
                                width: indicatorWidth,
                                transform: [{ translateX }, { scaleY }],
                            },
                        ]}
                    />

                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const focused = state.index === index;
                        const icons =
                            ICONS[route.name as keyof AppTabParamList];

                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });
                            if (!focused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        };

                        const isFirst = index === 0;
                        const isLast = index === state.routes.length - 1;

                        return (
                            <Pressable
                                key={route.key}
                                onPress={onPress}
                                accessibilityState={
                                    focused ? { selected: true } : {}
                                }
                                accessibilityLabel={
                                    options.tabBarAccessibilityLabel ??
                                    route.name
                                }
                                style={[
                                    styles.item,
                                    isFirst && { paddingLeft: edgePadding },
                                    isLast && { paddingRight: edgePadding },
                                ]}
                            >
                                <Ionicons
                                    name={
                                        focused ? icons.active : icons.inactive
                                    }
                                    size={ICON_SIZE}
                                    color="#161010"
                                />
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

export default function AppNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    // Definit la zone max disponible (ecran - marges) et centre la barre
    // dedans si elle est plus etroite (peu de boutons).
    positioner: {
        position: "absolute",
        left: 24,
        right: 24,
        bottom: 24,
        alignItems: "flex-end",
    },
    shadowWrapper: {
        borderRadius: 32,
        elevation: 4,
        shadowColor: "#161010",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    bar: {
        height: 64,
        borderRadius: 32,
        backgroundColor: "#fff",
        flexDirection: "row",
        overflow: "hidden",
    },
    indicator: {
        position: "absolute",
        top: INDICATOR_INSET,
        bottom: INDICATOR_INSET,
        left: 0,
        borderRadius: 32,
        backgroundColor: "#e5e5e5",
    },
    item: {
        flex: 1,
        maxWidth: ITEM_MAX_WIDTH,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
});
