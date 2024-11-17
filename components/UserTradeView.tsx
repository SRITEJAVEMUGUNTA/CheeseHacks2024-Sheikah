import { addCollectible, addUser } from "@/app/server/supabase";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
export function UserTradeView({ email }: { email: string }) {
  const [data, setData] = useState();

  return (
    <View
      style={{ width: "100%", justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ height: 10, width: "100%" }} />
      <IndividualView
        userName={"Absolute Demon"}
        tag="@BestReactCoder"
        profilePicture="https://rumrvajfoyzujiqodlyj.supabase.co/storage/v1/object/public/images/234202934/FullSizeRender.jpeg"
      />
    </View>
  );
}

function IndividualView({
  userName,
  tag,
  profilePicture,
}: {
  userName: string;
  tag: string;
  profilePicture: string;
}) {
  let jsonData: any = {
    key: "value",
    numberKey: 123,
    nestedObject: {
      innerKey: "innerValue",
    },
  };
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: profilePicture,
        }}
        style={styles.profilePicture}
      />
      <TouchableOpacity
        onPress={() => {
          //   const result = addCollectible({
          //     id: "09534",
          //     wayPointId: "239055",
          //     userId: "2358",
          //   }).then((response) => {
          //     console.log(response);
          //   });

          addUser({
            username: "sample",
            displayedCollectibleID: "wow",
            collectibleIDs: ["o23094053", "2359805"],
            LLMPrompts: jsonData,
            waypointIds: ["hello"],
          }).then((result) => {
            console.log(result);
          });
        }}
      >
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>{userName}</Text>
          <Text style={styles.subText}>{tag}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white", // change this
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "80%",
    justifyContent: "center",
    height: 120,
  },
  profilePicture: {
    height: "80%",
    width: "30%",
    borderRadius: 40,
    marginRight: 15,
  },
  textContainer: {
    height: "100%",
    width: "60%",
    justifyContent: "center",
  },
  mainText: {
    fontSize: 20,
    fontWeight: "bold",
    textOverflow: "ellipsis",
  },
  subText: {
    fontSize: 15,
    fontWeight: "bold",
    textOverflow: "ellipsis",
    color: "#D3D3D3",
  },
});
