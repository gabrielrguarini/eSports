import { FlatList, Image, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";

import logoImg from "../../assets/logo-nlw-esports.png";
import { Background } from "../../components/Background";

import { THEME } from "../../theme";
import { styles } from "./styles";
import { GameParams } from "../../@types/navigation";
import { TouchableOpacity } from "react-native";
import { Heading } from "../../components/Heading";
import { DuoCard, DuoCardProps } from "../../components/DuoCard";
import { DuoMatch } from "../../components/DuoMatch";

export function Game() {
    const [duos, setDuos] = useState<DuoCardProps[]>([]);
    const [discordDuoSelected, setdiscordDuoSelected] = useState("");
    const navigation = useNavigation();
    const route = useRoute();
    const game = route.params as GameParams;

    function handleGoBack() {
        navigation.goBack();
    }

    async function getDiscordUser(adsId: string) {
        fetch(`http://10.3.152.46:3333/ads/${adsId}/discord`)
            .then((response) => response.json())
            .then((data) => setdiscordDuoSelected(data.discord));
    }

    useEffect(() => {
        fetch(`http://10.3.152.46:3333/games/${game.id}/ads`)
            .then((response) => response.json())
            .then((data) => setDuos(data));
    }, []);

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <Entypo
                            name="chevron-thin-left"
                            color={THEME.COLORS.CAPTION_300}
                            size={20}
                        />
                    </TouchableOpacity>
                    <Image source={logoImg} style={styles.logo} />
                    <View style={styles.right} />
                </View>
                <Image
                    source={{ uri: game.bannerUrl }}
                    style={styles.cover}
                    resizeMode="stretch"
                />
                <Heading
                    title={game.title}
                    subtitle="Conecte-se e comece a jogar!"
                />
                <FlatList
                    data={duos}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <DuoCard
                            data={item}
                            onConnect={() => getDiscordUser(item.id)}
                        />
                    )}
                    horizontal
                    style={[styles.containerList]}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                        duos.length > 0
                            ? styles.contentList
                            : styles.emptyListContent,
                    ]}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyListText}>
                            Não há anúncios publicados para esse jogo.
                        </Text>
                    )}
                />
            </SafeAreaView>
            <DuoMatch
                visible={discordDuoSelected.length > 0}
                discord={discordDuoSelected}
                onClose={() => {
                    setdiscordDuoSelected("");
                }}
            />
        </Background>
    );
}
