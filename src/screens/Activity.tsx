import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { IconButton } from "react-native-paper";
import clsx from "clsx";
import CustomBackdrop from "../components/CustomBackdrop";
import GlassSvg from "../../assets/GlassSvg"

const Activity = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  // variables//possible snap points/height of sheet can be
  const snapPoints = useMemo(() => ["25%", "50%", "55%"], []);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
  }, []);
  //open/snap bottom sheet to a defined snap point
  //index === index of a snapPoint(given in %) in the snapPoints array
  const handleSnapPress = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);
  //close btm sheet
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsOpen(false);
  }, []);

  // renders
  return (
    <View className={clsx("flex-1")}>
      <View className="flex-row  justify-between items-center overflow-auto px-2">
        <Text>Past</Text>
        <IconButton
          icon="dots-vertical"
          iconColor="#10b981"
          mode="contained-tonal"
          containerColor="#e2e8f0"
          size={20}
          onPress={() => console.log("Pressed")}
        />
        <Button title="Close Sheet" onPress={handleClosePress} />
        <Button
          title="Open Sheet"
          onPress={() => handleSnapPress(snapPoints.length - 1)}
        />
      </View>
      <GlassSvg />
      <BottomSheet
        ref={bottomSheetRef}
        backdropComponent={isOpen ? CustomBackdrop : () => <></>}
        index={-1} //starting snap point index in snap points array, index -1 = hidden
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true} //drag down to close
       // onClose={() => setIsOpen(false)} //when sheet is closed
        handleIndicatorStyle={{ backgroundColor: "#10b981" }} //View style to be applied to the handle indicator component.
        // handleStyle={{ backgroundColor: "#10b981" }} //View style to be applied to the handle component.
        //backgroundStyle={{ backgroundColor: "green" }} //style to be applied to the background component
      >
        <BottomSheetScrollView>
          <View className="flex-1 p-8">
            <Text>Awesome 🎉</Text>
            <Button title="close sheet" onPress={handleClosePress} />
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default Activity;
