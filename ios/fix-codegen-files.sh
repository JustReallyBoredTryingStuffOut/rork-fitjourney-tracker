#!/bin/bash

# This script should be added as a "Run Script" build phase in Xcode
# Add it after the "Bundle React Native code and images" phase

echo "Fixing React Native codegen files..."

# Create the target directory
mkdir -p "${SRCROOT}/build/generated/ios"

# Find the DerivedData directory for this project
DERIVED_DATA_DIR=$(find ~/Library/Developer/Xcode/DerivedData -name "*FitJourneyTracker*" -type d | head -1)

if [ -z "$DERIVED_DATA_DIR" ]; then
    echo "Error: Could not find DerivedData directory for FitJourneyTracker"
    exit 1
fi

# Source directory where React Native codegen generates files
SOURCE_DIR="$DERIVED_DATA_DIR/Build/Intermediates.noindex/Pods.build/Release-iphoneos/ReactCodegen.build/DerivedSources/generated/source/codegen/out/build/generated/ios"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Warning: Source directory does not exist yet. React Native codegen may not have run."
    echo "Source directory: $SOURCE_DIR"
    exit 0
fi

# Copy all files from source to target
echo "Copying files from $SOURCE_DIR to ${SRCROOT}/build/generated/ios/"
cp -r "$SOURCE_DIR"/* "${SRCROOT}/build/generated/ios/"

echo "Successfully copied React Native codegen files!" 