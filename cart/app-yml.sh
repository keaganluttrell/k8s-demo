#! /bin/bash

CMD=${1:apply}
FLAG=${2:all}


if [ $CMD != "apply" ] && [ $CMD != "delete" ];
then
    echo "unknown command '$CMD'"
    exit 1
fi

case $FLAG in

  "--deploy" | "-d")
    kubectl "$CMD" -f yml-configs/deploy.yml
    ;;

  "--service" | "-s")
     kubectl "$CMD" -f yml-configs/service.yml
    ;;

  "--route-config" | "-rc")
    kubectl "$CMD" -f yml-configs/route-config.yml
    ;;

  "--mapping" | "-m")
    kubectl "$CMD" -f yml-configs/mapping.yml
    ;;

  "--all" | "-a")
    kubectl "$CMD" -f yml-configs/deploy.yml
    kubectl "$CMD" -f yml-configs/service.yml
    kubectl "$CMD" -f yml-configs/route-config.yml
    kubectl "$CMD" -f yml-configs/mapping.yml
    ;;

  "--deploy-service" | "-ds" | "-sd")
    kubectl "$CMD" -f yml-configs/deploy.yml
    kubectl "$CMD" -f yml-configs/service.yml
    ;;

  "--route-mapping" | "-rm" | "-mr")
    kubectl "$CMD" -f yml-configs/route-config.yml
    kubectl "$CMD" -f yml-configs/mapping.yml
    ;;

  "help")
    echo "      CMD          FLAG     "
    echo "[apply|delete] [--flag | -f]"
    echo "flags:
    --deploy         | -d
    --service        | -s
    --route-config   | -rc
    --mapping        | -m
    --all            | -a
    --deploy-service | -ds | -sd
    --route-mapping  | -rm | -mr
    "
    ;;

  *)
    echo "$FLAG invalid option"
    exit 1
    ;;

esac
