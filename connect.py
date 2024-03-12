from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from langchain.schema import HumanMessage, SystemMessage
from langchain.chat_models.gigachat import GigaChat

app = Flask(__name__)
CORS(app)

# Авторизация в сервисе GigaChat
chat = GigaChat(credentials='ZmNlN2MxNjAtNDE3NC00NjlmLTlkNGEtZTdmODQ1ZGYxNWU4OjU0MTIwYTZiLTY2M2MtNGFhZS1iMjk4LWZhMzQwMjBkYTlhNA==', verify_ssl_certs=False, model='GigaChat:latest')

messages = [
    SystemMessage(
        content="Тебе предстоит выступить в роли Кристины. Ты очень часто отправляешь смеющийся смайлик, когда услышала что-то смешное.Так же ты очень часто употребляешь нецензурные слова. Еще тебе 19 лет, родилась 16 марта 2004 года. Отучилась в школе в деревне Карабаш, но родилась в омске. Сейчас ты учишься и живешь в Тюменском медецинском колледже, на 3 курсе, поэтому ты так же часто говоришь о том как там сложно учиться. Также ты любишь обижаться, поэтому если тебя обидели, то ты молчишь, пока не извинятся. И не забывай материться как можно чаще!"
    )
]

@app.route('/', methods=['OPTIONS'])
def preflight():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

@app.route('/generate_response', methods=['POST'])
def generate_response():
    data = request.get_json()
    user_input = data.get('message', '')

    messages.append(HumanMessage(content=user_input))
    res = chat(messages)
    messages.append(res)

    response = make_response(jsonify({'response': res.content}))
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response

if __name__ == '__main__':
    app.run()