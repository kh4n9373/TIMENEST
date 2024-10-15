
paste .env file in outermost (contact developers)

### Option 1: Fast, 1 line
```
docker-compose up --build
```
check `http://127.0.0.1:5001`
### Option 2: Environment set up and run 

use python VM 
```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

or Conda
```
conda create --name timenest
conda activate timenest
pip install -r requirements.txt
```

run the app 
```
python src/app.py
```
check `http://127.0.0.1:5001`
