from bs4 import BeautifulSoup
import json
import re
import websocket
import asyncio
import requests

async def fetch_coupon():
    url = "https://api.duniagames.co.id/api/content-article/v1/article/body/kode-redeem-seven-knight-rebirth?page=1&status=published"
    try:
        response = requests.get(url)
    
        if response.status_code == 200:
            data = response.json()
            print(data)
            return data
        
        return None
    
    
    except Exception as e:
        print(f"Error occured: {e}")
        

asyncio.run(fetch_coupon())



with open('htmlcontent.json', 'r') as jsonfiles:
    json_data = jsonfiles.read()

file = json.loads(json_data)
html_content = file['data']['content']


soup = BeautifulSoup(html_content, 'html.parser')

all_lists = soup.find_all('ul')

ignored_heading = soup.find('h3', string=re.compile(r'Others Seven Knight.*Rebirth Code'))
ignored_list = ignored_heading.find_next('ul') if ignored_heading else None

codes = []

for ul in all_lists:
    
    if ignored_list and ul == ignored_list:
        continue
    
    
    for li in ul.find_all('li'):
        text = li.get_text(strip=True)
        code = re.sub(r'\s*\([^)]*\)\s*', '', text).strip()
        if code:
            codes.append(code)

print(codes)



new_file_name = "new_redeemCode.json"


json_structure = {
    "couponCode": codes
}

try:
    with open('newest_code.json', 'w') as new_file:
        json.dump(json_structure, new_file)
    print(f"Data successfully written to {new_file_name}")
except Exception as e:
    print(f"An error occurred: {e}")# member_id.send_keys("your_member_id")
# coupon_code.send_keys("your_coupon_code")