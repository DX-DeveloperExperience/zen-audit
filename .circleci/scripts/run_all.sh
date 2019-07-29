for script in ./*.sh
do
    if "$script" != "run_all.sh"
    then
        $script
    fi
done