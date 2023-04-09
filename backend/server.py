from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import requests
from bs4 import BeautifulSoup
import re

import json

import pytchat


import numpy as np
import pandas as pd

from flask import Flask, render_template, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()


import googleapiclient.discovery

import requests
from bs4 import BeautifulSoup


API_KEY = os.getenv("API_KEY")

api_service_name = "youtube"
api_version = "v3"

youtube = googleapiclient.discovery.build(
        api_service_name, api_version, developerKey = API_KEY)

app = Flask(__name__)
CORS(app)



tokenizer = AutoTokenizer.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')
model = AutoModelForSequenceClassification.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')


def sentiment_score(review):
    tokens = tokenizer.encode(review, return_tensors='pt')
    result = model(tokens)
    return int(torch.argmax(result.logits))+1



def comments(channel_ID, to_csv = False):
    # chat = pytchat.create(video_id=channel_ID)

    # flag = 0

    # while chat.is_alive():
    #     print("im inside live chat ")
    #     comm = []
    #     score = []
    #     count = 0
    #     live = []
    #     flag = 1
    #     for c in chat.get().sync_items():
    #         count+=1
    #         if(count<5):
    #             live.append(c.message)
    #         # print(f"{c.datetime} [{c.author.name}] - {c.message}")
    #     df = pd.DataFrame(live,columns=['review'])
    #     df['sentiment'] = df['review'].apply(lambda x: sentiment_score(x[:512]))
    #     for i in df['review']:
    #         comm.append(i)
    #     for j in df['sentiment']:
    #         score.append(j)

    #     del df
    #     return comm,score,flag


    comm = []
    score = []
    request_comm = youtube.commentThreads().list(
        part = 'snippet',
        videoId = channel_ID,
        maxResults = 100,
        # pageToken = 'QURTSl9pMVRPamFqVmhodnBaZVh5MHhiZ2RVd3ZRQjhUMlpuQ1Q1Qm91THB0Q1JKb2NpUWJoTExjemkxYkxGelgySzRUSXV0N3RUUlYxLXdXNUFVektQNTNZeUZIX2hLOGc='
    )

    response_comm = request_comm.execute()

    request_rep = youtube.commentThreads().list(
        part = 'replies',
        videoId = channel_ID,
        maxResults = 100,
        # pageToken = 'QURTSl9pMVRPamFqVmhodnBaZVh5MHhiZ2RVd3ZRQjhUMlpuQ1Q1Qm91THB0Q1JKb2NpUWJoTExjemkxYkxGelgySzRUSXV0N3RUUlYxLXdXNUFVektQNTNZeUZIX2hLOGc='
    )
        
    
    response_rep = request_rep.execute()
    res = response_rep['items'][0]
   
    # print(res['replies']['comments'][0]['snippet']['textDisplay'])
    comments = []

    for i in range(0,len(response_comm['items'])):
        res = response_comm['items'][i]
        result = res['snippet']['topLevelComment']['snippet']['textDisplay']
        print("printing comment",result)
        comments.append(result)
    print(comments)
    print(len(comments))

    df = pd.DataFrame(comments,columns=['review'])
    df['sentiment'] = df['review'].apply(lambda x: sentiment_score(x[:512]))
    print("\nprinting df",df)
    for i in df['review']:
        comm.append(i)
    for j in df['sentiment']:
        score.append(j)
    # df = df.drop("review", axis='columns')
    # df = df.drop("sentiment", axis='columns')
    del df
    # cmcopy,scorecpy = comm.copy,score.copy
    # comm = []
    # score = []
    # print("printing empty df",df)
    return comm,score

# final function 
# def sentiment(url):
#     r = requests.get(url)
#     soup = BeautifulSoup(r.text, 'html.parser')
#     regex = re.compile('.*comment.*')
#     results = soup.find_all('p', {'class':regex})
#     reviews = [result.text for result in results]
#     df = pd.DataFrame(np.array(reviews), columns=['review'])
#     df['sentiment'] = df['review'].apply(lambda x: sentiment_score(x[:512]))
#     for i in df['review']:
#         comm.append(i)
#     for j in df['sentiment']:
#         score.append(j)
#     print("printing df",df)
#     print(comm,score)
#     return comm,score


@app.route('/',methods=["POST","GET"])
def main():
    # c,s = comments('kffacxfA7G4')
    # print(request.json['url'])
    url = request.json['url']
    # print("printing_url",url)

    # Send a GET request to the page
    response = requests.get(url)
    # Create a BeautifulSoup object
    soup = BeautifulSoup(response.text, 'html.parser')
    title = soup.find_all('yt-formatted-string', class_='style-scope ytd-watch-metadata')


    x = url.split('=')
    id = x[1].split('&')
    print(id[0])
    c,s = comments(id[0])
    # c, s = sentiment('https://www.yelp.com/biz/social-brew-cafe-pyrmont')
    # return f"{c},{s}"
    return json.dumps([c,s])



# if __name__ =='__main__':
    #app.debug = True
app.run()