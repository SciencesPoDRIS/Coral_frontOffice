# Coral_frontOffice
FrontOffice based on an instance of Coral to display the electronic resources.

## Load data
Delete existing index (if exists)

`> curl -X DELETE 'http://localhost:9200/INDEX_NAME/'`

Recreate index with mapping

`> curl -X PUT http://localhost:9200/INDEX_NAME -d @mapping.json`

Populate database via logstatsh

`> cd /path/to/logstash/bin`

`> ./logstash -f /path/to/logstash/conf/get-data.conf`


## Install Project
In a terminal, go to your work directory and launch :


1. Clone locally this project

    `> git clone https://github.com/SciencesPoDRIS/Coral_frontOffice.git`

2. Install Node modules

    `> npm install`

3. Install Bower modules

    `> bower install`

4. Copy conf.default.json file into conf.json and edit it

    `> cp conf/conf.default.json conf/conf.json | vim conf/conf.json`

5. Modify the default environment variables to your own ones

6. Launch Gulp build (default Gulp environment will be development)

    `> gulp`


## Credits
[Sciences Po - Library](http://www.sciencespo.fr/bibliotheque/en)


## Licenses
[LGPL V3.0](http://www.gnu.org/licenses/lgpl.txt "LGPL V3.0")
[CECILL-C](http://www.cecill.info/licences/Licence_CeCILL-C_V1-fr.html "CECILL-C")
