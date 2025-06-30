#!/bin/bash

# Script to copy React Native codegen files to the expected location
# This should be run after the React Native codegen phase completes

echo "Copying React Native codegen files..."

# Create the target directory
mkdir -p ios/build/generated/ios

# Find the DerivedData directory for this project
DERIVED_DATA_DIR=$(find ~/Library/Developer/Xcode/DerivedData -name "*FitJourneyTracker*" -type d | head -1)

if [ -z "$DERIVED_DATA_DIR" ]; then
    echo "Error: Could not find DerivedData directory for FitJourneyTracker"
    exit 1
fi

echo "Found DerivedData directory: $DERIVED_DATA_DIR"

# Source directory where React Native codegen generates files
SOURCE_DIR="$DERIVED_DATA_DIR/Build/Intermediates.noindex/Pods.build/Release-iphoneos/ReactCodegen.build/DerivedSources/generated/source/codegen/out/build/generated/ios"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Warning: Source directory does not exist yet. React Native codegen may not have run."
    echo "Source directory: $SOURCE_DIR"
    exit 0
fi

# Copy all files from source to target
echo "Copying files from $SOURCE_DIR to ios/build/generated/ios/"
cp -r "$SOURCE_DIR"/* ios/build/generated/ios/

echo "Successfully copied React Native codegen files!"
echo "Files copied:"
ls -la ios/build/generated/ios/ | head -10 