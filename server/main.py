import time
from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
app.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245'
conn = sqlite3.connect('blog.db')

@app.route("/time")
def home():
  return {'time': time.time(), 'text': 'Hello from the bacteasdfadskend API'}

@app.route("/search")
def getUser():
  recipeTypeQuery = request.args.get('recipetype')
  # conn = sqlite3.connect('kitchin-main.db')
  adjustedQuery = "is" + recipeTypeQuery.capitalize()
  print(adjustedQuery)
  conn = sqlite3.connect('main.db')
  print("Query: " + recipeTypeQuery)
  cur = conn.cursor()
  # query = """SELECT * FROM recipe WHERE ? = ?"""
  query = "SELECT * FROM recipe WHERE isLunch = 1"
  # cur.execute(query, (adjustedQuery,1))
  cur.execute(query)
  recipes = cur.fetchall()
  listOfRecipes = []

  # query = """SELECT * FROM recipes"""
  # cur.execute(query)
  # recipes = cur.fetchall()
  # n = 0
  # for recipe in recipes:
  #   for item in recipe:
  #     print(n)
  #     print(item)
  #     n += 1

  for recipe in recipes:
    # print(recipe)
   
    parsedRecipe = {
      "recipeID": recipe[0],
      "recipeName": recipe[1],
      "cookDuration": recipe[2],
      "prepDuration": recipe[3],
      "recipeDescription": recipe[4],
      "instructions": recipe[5],
      "servings": recipe[6],
      "calories": recipe[7],
      "fat": recipe[8],
      "protein": recipe[9],
      "sodium": recipe[10],
      "sugar": recipe[11],
      "isBreakfast": recipe[12],
      "isLunch": recipe[13],
      "isDinner": recipe[14],
      "isSnacks": recipe[15],
      "isDrinks": recipe[16],
      # "imageUrl": recipe[12]
    }
    listOfRecipes.append(parsedRecipe)
  response = {
    "recipes": listOfRecipes
  }

  print(response)
  return response

# @app.route("/search")
# def getRecipes():
#   conn = sqlite3.connect('kitchin-test-db.db')
#   cur = conn.cursor()
#   query = "SELECT * FROM recipes"
#   cur.execute(query)
#   recipe = cur.fetchone()
#   res = {
#     "name": recipe[0],
#     "email": recipe[1],
#     "id": recipe[2]
#   }
#   print(res)
#   return res

@app.route("/hello")
def doThing():
  test = request.args.get('test')
  print(test)
  return test
  
if __name__ == "__main__":
    app.run()

