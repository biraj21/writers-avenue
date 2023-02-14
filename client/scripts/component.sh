if (("$#" < 1)); then
    echo "Error: At least 1 component is required"
    echo "Usage: component COMPONENT_NAME..."
fi

for arg in "$@"; do
    mkdir -p "./src/$arg"
    touch "./src/$arg/$arg.jsx" "./src/$arg/$arg.scss"

    template=$(cat << EOF
import "./src/$arg.scss"

export default function $arg() {
  return <></>;
}
EOF
)

    echo "$template" > "src/$arg/$arg.jsx"
done
