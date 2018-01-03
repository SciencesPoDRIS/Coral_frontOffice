# Coral_frontOffice
FrontOffice based on an instance of Coral to display the electronic resources.

## Load data
Delete existing index

`> curl -X DELETE 'http://localhost:9200/INDEX_NAME/'`

Recreate index with mapping

`> curl -X PUT http://localhost:9200/INDEX_NAME -d @mapping.json`

Populate database via logstatsh

`> cd /path/to/logstash/bin`

`> ./logstash -f /path/to/logstash/conf/get-data.conf`


## Install Project
In a terminal, launch :

`> npm install`

`> bower install`

`> gulp`


## Credits
[Sciences Po - Library](http://www.sciencespo.fr/bibliotheque/en)


## Licenses
[LGPL V3.0](http://www.gnu.org/licenses/lgpl.txt "LGPL V3.0")
[CECILL-C](http://www.cecill.info/licences/Licence_CeCILL-C_V1-fr.html "CECILL-C")
