#!/bin/bash

echo "Starting API tests for Wishlist..."

BASE_URL="http://localhost:3000"
COOKIE_FILE="session_cookie.txt"

# Step 1: Start with a clean slate by removing the previous session cookie file
rm -f $COOKIE_FILE

# Step 2: Test User Registration
echo "Testing User Registration..."
response=$(curl -X POST "$BASE_URL/register" \
  -d "username=testuser&password=password123&confirmPassword=password123" \
  -H "Content-Type: application/x-www-form-urlencoded" -s -w "%{http_code}" -o /dev/null)

if [ "$response" -eq 302 ]; then
    echo "✅ Registration test PASSED: User registered successfully."
else
    echo "❌ Registration test FAILED: Expected HTTP 302 but got $response."
    exit 1
fi

# Step 3: Test User Login and Save Session Cookie
echo "Testing User Login..."
response=$(curl -X POST "$BASE_URL/login" \
  -d "username=testuser&password=password123" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -c $COOKIE_FILE -s -w "%{http_code}" -o /dev/null)

if [ "$response" -eq 302 ] && [ -s $COOKIE_FILE ]; then
    echo "✅ Login test PASSED: User logged in successfully."
else
    echo "❌ Login test FAILED: Expected HTTP 302 but got $response."
    exit 1
fi

# Step 4: Check Database File
echo "Checking Database Connection..."
if [ -f "./wishlist.db" ]; then
    echo "✅ Database connection PASSED: wishlist.db exists."
else
    echo "❌ Database connection FAILED: wishlist.db is missing."
    exit 1
fi

# Step 5: Test Adding an Item to the Wishlist
echo "Testing Add Item to Wishlist..."
response=$(curl -X POST "$BASE_URL/add" \
  -d "name=TestItem&description=TestDescription" \
  -b $COOKIE_FILE -s -w "%{http_code}" -o /dev/null)

if [ "$response" -eq 302 ]; then
    echo "✅ Add Item test PASSED: Item added successfully."
else
    echo "❌ Add Item test FAILED: Expected HTTP 302 but got $response."
    exit 1
fi

# Step 6: Test Reading Wishlist Items
echo "Testing Read Wishlist Items..."
response=$(curl -X GET "$BASE_URL/" -b $COOKIE_FILE -s -w "%{http_code}" -o /dev/null)

if [ "$response" -eq 200 ]; then
    echo "✅ Read Wishlist test PASSED: Items retrieved successfully."
else
    echo "❌ Read Wishlist test FAILED: Expected HTTP 302 but got $response."
    exit 1
fi

# Step 7: Test Updating an Item (Assuming ID=1)
echo "Testing Update Wishlist Item (ID=1)..."
response=$(curl -X POST "$BASE_URL/update/1" \
  -d "name=UpdatedItem&description=UpdatedDescription" \
  -b $COOKIE_FILE -s -w "%{http_code}" -o /dev/null)

if [ "$response" -eq 302 ]; then
    echo "✅ Update Item test PASSED: Item updated successfully."
else
    echo "❌ Update Item test FAILED: Expected HTTP 302 but got $response."
    exit 1
fi

# Step 8: Test Deleting an Item (Assuming ID=1)
echo "Testing Delete Wishlist Item (ID=1)..."
response=$(curl -X GET "$BASE_URL/delete/1" -b $COOKIE_FILE -s -w "%{http_code}" -o /dev/null)

if [ "$response" -eq 302 ]; then
    echo "✅ Delete Item test PASSED: Item deleted successfully."
else
    echo "❌ Delete Item test FAILED: Expected HTTP 302 but got $response."
    exit 1
fi

# Step 9: Test User Logout
echo "Testing User Logout..."
response=$(curl -X GET "$BASE_URL/logout" -b $COOKIE_FILE -s -w "%{http_code}" -o /dev/null)

if [ "$response" -eq 302 ]; then
    echo "✅ Logout test PASSED: User logged out successfully."
else
    echo "❌ Logout test FAILED: Expected HTTP 30302 but got $response."
    exit 1
fi

echo "All tests completed successfully."

