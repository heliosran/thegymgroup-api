{
  description = "The Gym Group API frontend development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          name = "thegymgroup-api-shell";

          packages = with pkgs; [
            bun
            nodejs_22
            git
          ];

          shellHook = ''
            echo "The Gym Group API dev shell"
            echo "- bun: $(bun --version)"
            echo "- node: $(node --version)"
            echo "Run: bun install && bun run dev"
          '';
        };
      });
}
