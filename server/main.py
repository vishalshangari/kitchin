import time
from flask import Flask, request, jsonify
from operator import itemgetter
import sqlite3
import pprint

app = Flask(__name__)
app.config["SECRET_KEY"] = "5791628bb0b13ce0c676dfde280ba245"

DB_LOCATION = "db/kitchin.db"

defaultError = {"status": "error", "data": "Something went wrong"}


def returnSucess(data):
    {"status": "success", "data": data}


@app.route("/user", methods=["POST"])
def createUser():
    newUserData = request.json
    conn = sqlite3.connect(DB_LOCATION)
    conn.execute("PRAGMA foreign_keys = 1")
    cur = conn.cursor()
    try:
        insertUserQuery = f"INSERT INTO Users(username, fullName, age) VALUES ('{newUserData['general']['kitchinusername']}', '{newUserData['general']['name']}', {newUserData['general']['age']})"
        cur.execute(insertUserQuery)
        if len(newUserData["healthIssues"]) > 0:
            for issue in newUserData["healthIssues"]:
                cur.execute(
                    f"INSERT INTO UserHealthIssues VALUES ('{newUserData['general']['kitchinusername']}', '{issue}', 'mediumLvl', 'Issue Description')"
                )
        conn.commit()
        return {"status": "success"}
    except sqlite3.Error as er:

        if "CHECK" in er.args[0]:
            return {"status": "error", "content": "CHECK"}
        else:
            return {"status": "error", "content": "UNIQUE"}


@app.route("/user", methods=["DELETE"])
def deleteUser():
    userData = request.json
    username = userData["username"]
    conn = sqlite3.connect(DB_LOCATION)
    conn.execute("PRAGMA foreign_keys = 1")
    cur = conn.cursor()
    try:
        deleteQuery = f"DELETE FROM Users WHERE username = '{username}'"

        cur.execute(deleteQuery)
        conn.commit()
        return {"status": "success"}
    except sqlite3.Error as er:

        return {"status": "error"}


@app.route("/users")
def getUsers():
    conn = sqlite3.connect(DB_LOCATION)
    conn.execute("PRAGMA foreign_keys = 1")
    conn.row_factory = sqlite3.Row
    usersQuery = "SELECT * FROM Users"
    cur = conn.cursor()
    conn.execute("PRAGMA foreign_keys = 1")
    cur.execute(usersQuery)
    allUsers = [dict(row) for row in cur.fetchall()]
    healthIssueQ = "SELECT * FROM HealthIssues"
    cur.execute(healthIssueQ)
    healthIssues = [dict(row) for row in cur.fetchall()]
    cur.execute(usersQuery)

    return {"users": allUsers, "healthIssues": healthIssues}


@app.route("/favorite-recipe", methods=["POST"])
def favoriteRecipe():
    userAndRecipe = request.json
    conn = sqlite3.connect(DB_LOCATION)
    conn.execute("PRAGMA foreign_keys = 1")
    cur = conn.cursor()

    try:
        timeNow = time.time()
        insertUserQuery = f"INSERT INTO RecipeFavoritedByUser(username, recipeID, dateFavorited) VALUES ('{userAndRecipe['username']}', '{userAndRecipe['recipeID']}', {timeNow})"
        cur.execute(insertUserQuery)
        conn.commit()
        return {"status": "success"}
    except sqlite3.Error as er:

        if "UNIQUE" in er.args[0]:
            return {"status": "error", "content": "UNIQUE"}
        else:
            return {"status": "error"}


@app.route("/all-recipes")
def getAllRecipes():
    conn = sqlite3.connect(DB_LOCATION)
    conn.execute("PRAGMA foreign_keys = 1")
    conn.row_factory = sqlite3.Row
    recipesQuery = "SELECT * FROM Recipe"
    cur = conn.cursor()
    cur.execute(recipesQuery)
    data = [dict(row) for row in cur.fetchall()]
    return {"status": "success", "recipes": data}


def getRecipeCuisines(r):
    result = []
    for key in r:
        if "cuisine-type-" in key and r[key] is not False:
            result.append(r[key])
    return result


def getRecipeHealthLabels(r):
    result = []
    for key in r:
        if "health-label-" in key and r[key] is not False:
            result.append(r[key])
    return result


def populateRecipeCuisine(rid, cuisines):
    conn = sqlite3.connect(DB_LOCATION)
    conn.execute("PRAGMA foreign_keys = 1")
    try:
        cursor = conn.cursor()
        data = """INSERT INTO RecipeCuisine (recipeID,cuisineType) VALUES (?, ?);"""
        for cuisine in cuisines:
            cursor.execute(
                data,
                (
                    rid,
                    cuisine,
                ),
            )
        conn.commit()

    except sqlite3.Error as error:

        raise error


def populateRecipeLabels(rid, labels):
    conn = sqlite3.connect(DB_LOCATION)
    conn.execute("PRAGMA foreign_keys = 1")
    try:
        cursor = conn.cursor()
        data = """INSERT INTO RecipeHasHealthLabel (recipeID,label) VALUES (?, ?);"""
        for label in labels:
            cursor.execute(
                data,
                (
                    rid,
                    label,
                ),
            )
        conn.commit()
    except sqlite3.Error as error:
        raise error


@app.route("/recipe", methods=["POST"])
def addRecipe():
    newRecipeData = request.json

    # return {"true": False}
    conn = sqlite3.connect(DB_LOCATION)
    conn.execute("PRAGMA foreign_keys = 1")
    try:
        name = newRecipeData["recipeName"]
        imgURL = (
            newRecipeData["imageURL"] if len(newRecipeData["imageURL"]) > 0 else None
        )
        webURL = newRecipeData["webURL"] if len(newRecipeData["webURL"]) > 0 else None
        desc = (
            newRecipeData["recipeDescription"]
            if len(newRecipeData["recipeDescription"]) > 0
            else None
        )
        cookDuration = newRecipeData["cookDurationMins"]
        prepDuration = None
        instr = (
            newRecipeData["instructions"]
            if len(newRecipeData["instructions"]) > 0
            else None
        )
        servings = newRecipeData["servings"]
        ingredients = (
            newRecipeData["ingredients"]
            if len(newRecipeData["ingredients"]) > 0
            else None
        )
        calories = newRecipeData["calories"]
        fat = newRecipeData["fat"]
        protein = newRecipeData["protein"]
        sodium = newRecipeData["sodium"]
        sugar = newRecipeData["sugar"]
        isB = newRecipeData["breakfast"]
        isL = newRecipeData["lunch"]
        isD = newRecipeData["dinner"]
        isS = newRecipeData["snack"]
        isDrinks = newRecipeData["beverage"]
        recipeWithParams = """INSERT INTO recipe
                        (recipeName, imageURL, websiteURL, recipeDescription, cookDurationMins, prepDurationMins, instructions, servings, ingredients, calories, fat, protein, sodium, sugar, isBreakfast, isLunch, isDinner, isSnacks, isDrinks) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"""
        data_tuple = (
            name,
            imgURL,
            webURL,
            desc,
            cookDuration,
            prepDuration,
            instr,
            servings,
            ingredients,
            calories,
            fat,
            protein,
            sodium,
            sugar,
            isB,
            isL,
            isD,
            isS,
            isDrinks,
        )
        cur = conn.cursor()
        cur.execute(recipeWithParams, data_tuple)
        rid = cur.lastrowid
        conn.commit()
        recipeCuisines = getRecipeCuisines(newRecipeData)
        recipeHealthLabels = getRecipeHealthLabels(newRecipeData)
        populateRecipeCuisine(rid, recipeCuisines)
        populateRecipeLabels(rid, recipeHealthLabels)

        return {"status": "success"}
    except sqlite3.Error as er:

        return {"status": "error"}


@app.route("/recipe", methods=["DELETE"])
def deleteRecipe():
    requestData = request.json
    conn = sqlite3.connect(DB_LOCATION)
    conn.execute("PRAGMA foreign_keys = 1")
    try:
        unstockQuery = (
            f"DELETE FROM Recipe WHERE recipeID = '{requestData['recipeID']}'"
        )
        cur = conn.cursor()
        cur.execute(unstockQuery)
        conn.commit()
        return {"status": "success"}
    except sqlite3.Error as er:
        if "UNIQUE" in er.args[0]:
            return {"status": "error", "content": "UNIQUE"}
        else:
            return {"status": "error"}


@app.route("/ingredient", methods=["DELETE"])
def unstockIngredient():
    requestData = request.json
    conn = sqlite3.connect(DB_LOCATION)
    conn.execute("PRAGMA foreign_keys = 1")
    try:
        unstockQuery = f"DELETE FROM IngredientInStock WHERE ingredientName = '{requestData['ingredientName']}'"
        cur = conn.cursor()
        cur.execute(unstockQuery)
        conn.commit()
        return {"status": "success"}
    except sqlite3.Error as er:
        if "UNIQUE" in er.args[0]:
            return {"status": "error", "content": "UNIQUE"}
        else:
            return {"status": "error"}


@app.route("/ingredient", methods=["PUT"])
def updateIngredient():
    updateData = request.json

    conn = sqlite3.connect(DB_LOCATION)
    conn.execute("PRAGMA foreign_keys = 1")
    try:
        unstockQuery = f"UPDATE IngredientInStock SET storedAmount = {updateData['newQty']} WHERE ingredientName = '{updateData['ingredientName']}'"
        cur = conn.cursor()
        cur.execute(unstockQuery)
        conn.commit()
        return {"status": "success"}
    except sqlite3.Error as er:
        if "UNIQUE" in er.args[0]:
            return {"status": "error", "content": "UNIQUE"}

        return {"status": "error"}


@app.route("/ingredient", methods=["POST"])
def handleAddIngredient():
    newIngredientData = request.json

    conn = sqlite3.connect(DB_LOCATION)
    conn.execute("PRAGMA foreign_keys = 1")
    try:
        insertQuery = f"INSERT INTO IngredientInStock(ingredientName, storedAmount, storedType, expiryDate) VALUES ('{newIngredientData['ingredientName']}', {newIngredientData['amount']}, '{newIngredientData['quantityType']}', '{newIngredientData['expirationDate']}')"
        cur = conn.cursor()
        cur.execute(insertQuery)
        conn.commit()
        return {"status": "success"}
    except sqlite3.Error as er:
        return {"status": "error"}


@app.route("/ingredients")
def getAllIngredientsInStock():
    conn = sqlite3.connect(DB_LOCATION)
    conn.execute("PRAGMA foreign_keys = 1")
    conn.row_factory = sqlite3.Row
    ingredientsQuery = "SELECT * FROM IngredientInStock ORDER BY expiryDate ASC"
    cur = conn.cursor()
    cur.execute(ingredientsQuery)
    data = [dict(row) for row in cur.fetchall()]
    return {"status": "success", "ingredients": data}


@app.route("/dashboard")
def getUserDashboard():
    user = request.args.get("username")
    conn = sqlite3.connect(DB_LOCATION)
    conn.row_factory = sqlite3.Row
    totalRecipesQuery = """
      SELECT COUNT(*) AS count FROM Recipe
    """
    totalIngredientsQuery = """
      SELECT COUNT(*) AS count FROM Ingredient
    """
    totalIngredientsInStockQuery = """
      SELECT COUNT(*) AS count FROM IngredientInStock
    """
    userFavRecipesQuery = """
      SELECT Recipe.*,  T.dateFavorited FROM Recipe
      INNER JOIN (
        SELECT * FROM RecipeFavoritedByUser
        WHERE username = ?) T
      ON Recipe.recipeID = T.recipeID
      ORDER BY T.dateFavorited DESC
    """
    userAddedRecipesQuery = """
      SELECT Recipe.*,  T.dateAdded FROM Recipe
      INNER JOIN (
        SELECT * FROM RecipeAddedByUser
        WHERE username = ?) T
      ON Recipe.recipeID = T.recipeID
      ORDER BY T.dateAdded DESC
    """
    expiringIngredientsQuery = """
      SELECT * FROM IngredientInStock
      WHERE expiryDate < DATE('now', '+7 days')
      ORDER BY expiryDate ASC
    """
    cuisineTypesCountQuery = """
      SELECT cuisineType, COUNT(*) AS ct FROM RecipeCuisine
      GROUP BY cuisineType;
    """
    healthLabelsCountQuery = """
      SELECT label, COUNT(*) AS ct FROM RecipeHasHealthLabel
      GROUP BY label;
    """
    cur = conn.cursor()
    cur.execute(totalRecipesQuery)
    totalRecipesData = dict(cur.fetchone())
    cur.execute(totalIngredientsQuery)
    totalIngredientsData = dict(cur.fetchone())
    cur.execute(totalIngredientsInStockQuery)
    totalIngredientsInStockData = dict(cur.fetchone())
    cur.execute(userFavRecipesQuery, (user,))
    userFavRecipesData = [dict(row) for row in cur.fetchall()]
    cur.execute(userAddedRecipesQuery, (user,))
    userAddedRecipesData = [dict(row) for row in cur.fetchall()]
    cur.execute(expiringIngredientsQuery)
    expiringIngredientsData = [dict(row) for row in cur.fetchall()]
    cur.execute(cuisineTypesCountQuery)
    cuisineTypesCountData = [dict(row) for row in cur.fetchall()]
    cur.execute(healthLabelsCountQuery)
    healthLabelsCountData = [dict(row) for row in cur.fetchall()]
    returnData = {
        "totalRecipes": totalRecipesData,
        "totalIngredients": totalIngredientsData,
        "totalIngredientsInStock": totalIngredientsInStockData,
        "userFavRecipes": userFavRecipesData,
        "userAddedRecipes": userAddedRecipesData,
        "expiringIngredients": expiringIngredientsData,
        "cuisineTypesCount": cuisineTypesCountData,
        "healthLabelsCount": healthLabelsCountData,
    }
    return returnData


@app.route("/search-parameters")
def getSearchParamters():
    conn = sqlite3.connect(DB_LOCATION)

    conn.execute("PRAGMA foreign_keys = 1")
    # conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cuisineTypesQuery = "SELECT * FROM Cuisine"
    cur.execute(cuisineTypesQuery)
    allCuisines = cur.fetchall()

    healthLabels = "SELECT * FROM HealthLabel"
    cur.execute(healthLabels)
    allHealthLabels = cur.fetchall()
    return {"cuisineTypes": list(allCuisines), "healthLabels": allHealthLabels}


"""
params
recipeType: one of (breakfast, dinner, lunch, snacks, beverages)
"""


@app.route("/search")
def search():
    queryParams = request.args.to_dict()
    try:
        conn = sqlite3.connect(DB_LOCATION)

        conn.execute("PRAGMA foreign_keys = 1")
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        dropViewsScript = """
          DROP VIEW IF EXISTS STEP1;
          DROP VIEW IF EXISTS STEP2;
          DROP VIEW IF EXISTS STEP3;
        """
        cur.executescript(dropViewsScript)
        query = "SELECT * FROM Recipe"
        # 1. filter for recipe type
        if "recipeType" in queryParams and len(queryParams["recipeType"]) > 0:
            adjustedRecipeTypeParam = "is" + queryParams["recipeType"]
            query += " WHERE " + adjustedRecipeTypeParam + " = 1"

        cur.execute("CREATE VIEW STEP1 AS " + query)
        # 2. filter for cuisine type
        query = """
          SELECT STEP1.*, RecipeCuisine.cuisineType FROM STEP1
          LEFT JOIN RecipeCuisine
          ON STEP1.recipeID = RecipeCuisine.recipeID
          WHERE cuisineType IN (%s)
        """
        if "cuisineType" in queryParams:
            types = queryParams["cuisineType"].split(",")
            types = [types] if isinstance(types, str) else types
            formattedTypesForQuery = ""
            for t in types:
                inpt = "'%s',"
                inpt = inpt % t
                formattedTypesForQuery += inpt
            formattedTypesForQuery = formattedTypesForQuery[:-1]
            cur.execute("CREATE VIEW STEP2 AS " + (query % formattedTypesForQuery))
        else:
            cur.execute("CREATE VIEW STEP2 AS SELECT * FROM STEP1")

        # 3. filter for health labels -- relational division - NEW
        if "healthLabels" in queryParams:
            healthLabelArgs = queryParams["healthLabels"].split(",")
            iterableHealthLabelArgs = [(i1,) for i1 in healthLabelArgs]
            cur = conn.cursor()
            tempTableCreationQuery = """
            DROP TABLE IF EXISTS T1;
            CREATE TABLE T1 (label TEXT);
            """
            cur.executescript(tempTableCreationQuery)
            tempTablePopulationQuery = """
              INSERT INTO T1 VALUES (?);
            """
            cur.executemany(tempTablePopulationQuery, iterableHealthLabelArgs)
            healthLabelDivisionQuery = """
              SELECT * FROM STEP2
              WHERE STEP2.recipeID IN (
                SELECT RecipeHasHealthLabel.recipeID FROM RecipeHasHealthLabel
                EXCEPT
                SELECT recipeID FROM (
                  SELECT Recipe.recipeID, T1.label
                  FROM Recipe, T1
                  EXCEPT
                  SELECT recipeID, label FROM RecipeHasHealthLabel)
              );
            """
            cur.execute("CREATE VIEW STEP3 AS " + healthLabelDivisionQuery)
        else:
            cur.execute("CREATE VIEW STEP3 AS SELECT * FROM STEP2")
        maxT = 1200
        if "maxCookingTime" in queryParams:
            maxT = queryParams["maxCookingTime"]
        cur.execute("SELECT * FROM STEP3 WHERE cookDurationMins < " + str(maxT))
        data = [dict(row) for row in cur.fetchall()]
        if "keywords" in queryParams and len(data) > 1:

            data = sortByKeywords(data, queryParams["keywords"])

        return {"status": "success", "recipes": data}
    except sqlite3.Error as e:

        return defaultError


def sortByKeywords(data, keywordsInput):
    keywords = keywordsInput.split(",")
    for r in data:
        matches = 0
        for keyword in keywords:
            for val in r.values():
                if isinstance(val, str) and keyword in val:
                    matches += 1
        r["matches"] = matches
    sortedData = sorted(data, key=itemgetter("matches"), reverse=True)
    fitleredData = [r for r in sortedData if r["matches"] > 0]
    return fitleredData


if __name__ == "__main__":
    app.run()
