.PHONY: all app db seed test stress clean

all: db app

app:
	@echo "Execute Applications"

db:
	@echo "Migrate database"

seed:
	@echo "Insert test data"

test:
	@echo "Run tests"

stop:
	@echo "Stoping containers"

clean:
	@echo "Remove all dependencies"