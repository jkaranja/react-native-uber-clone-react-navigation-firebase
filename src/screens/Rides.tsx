import {
  Text,
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Searchbar } from "react-native-paper";

import { Avatar, Button, Card } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../types/navigator";

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="folder" />;
type RidesProps = NativeStackScreenProps<StackParamList, "Rides">;

const Rides = ({ navigation }: RidesProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query: string) => setSearchQuery(query);

  return (
    <ScrollView
      className="p-6 overflow-auto h-[500]"
      showsVerticalScrollIndicator={false}
    >
      <Searchbar
        placeholder="Where to?"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <Text className="text-2xl my-3">Suggestions</Text>

      <View className="flex-row justify-between gap-x-1">
        <Card>
          <Card.Content>
            <Text className=" my-3">Card title</Text>
            <Text className=" my-3">Card content</Text>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text className=" my-3">Card title</Text>
            <Text className=" my-3">Card content</Text>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text className=" my-3">Card title</Text>
            <Text className=" my-3">Card content</Text>
          </Card.Content>
        </Card>
      </View>

      <View className="my-4">
        <Card>
          <Card.Title
            title="Card Title"
            subtitle="Card Subtitle"
            left={LeftContent}
            right={LeftContent}
          />
          <Card.Content>
            <Text>Card title</Text>
            <Text>Card content</Text>
          </Card.Content>
          <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
        </Card>
      </View>
      <View className="my-4">
        <Card>
          <Card.Title
            title="Card Title"
            subtitle="Card Subtitle"
            left={LeftContent}
            right={LeftContent}
          />
          <Card.Content>
            <Text>Card title</Text>
            <Text>Card content</Text>
          </Card.Content>
          <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
        </Card>
      </View>
    </ScrollView>
  );
};

export default React.memo(Rides);
