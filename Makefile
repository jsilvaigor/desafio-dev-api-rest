.PHONY: all create_netwotk app db clean

all: db app

create_netwotk:
	@echo "Creating network mini_bank_network"
	./scripts/create_docker_network.sh

app: db
	@echo "Execute Application"
	./scripts/create_app.sh

db: create_netwotk
	@echo "Creating database"
	./scripts/create_db.sh

stop:
	@echo "Stoping containers"
	./scripts/stop_all.sh

clean:
	@echo "Remove all dependencies"
	./scripts/remove_all.sh