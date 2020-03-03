newman run APITestSample.postman_collection.json \
  -d data.json \
  -r htmlextra \
  --reporter-htmlextra-export testreport.html \
  --reporter-htmlextra-template mytemplat.hbs \
  --environment apitestsample.postman_environment.json
