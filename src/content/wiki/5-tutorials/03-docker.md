---
title: Containers
description: Namespaces, cgroups, union filesystems and the OCI image format
---

A container is a process with a restricted view of the kernel's global namespaces and an accounting limit attached. Linux has no container object, which is why the abstraction leaks where it does.

## What isolation is made of

Namespaces virtualise a global resource. Mount namespaces give a process its own filesystem tree, PID namespaces renumber processes so the entrypoint sees itself as 1, network namespaces provide a separate stack with its own interfaces and routing table, and UTS, IPC, user, cgroup and time namespaces cover the rest.

The user namespace is the one that changes the security story, since it maps a UID inside to a different UID outside, and root inside a user namespace holds capabilities only within it. Rootless containers are built on this. Without it, root in the container is root on the host wherever the isolation fails.

Cgroups v2 handle accounting and limits: CPU weight and quota, memory limits with the OOM killer attached to the cgroup, IO weights. A memory limit is enforced by killing, so a container exceeding it dies with status 137 and no explanation in its own logs, which is the most commonly misdiagnosed container failure there is.

Seccomp filters the syscall surface, and the default profile blocks around forty syscalls. Capabilities split root's authority into pieces, so dropping all and adding back `NET_BIND_SERVICE` is the shape of a well-configured service.

## Images and layers

An image is a manifest, a config blob, and an ordered list of layer tarballs, all addressed by digest. The config holds environment, entrypoint and layer diff IDs, and its digest is the image ID, so an image's identity covers its full content.

Layers stack through overlayfs. Reads fall through the lower layers to the first hit, and a write copies the file up into the writable upper layer, which is why modifying a large file costs a full copy on first write. Deleting a file from a lower layer creates a whiteout in the upper one, so the bytes remain in the image and the layer history is readable by anyone holding it.

That last point has security consequences. A secret added in one layer and removed in another is still in the image. Multi-stage builds and build secrets are the two answers, and neither is optional once a registry is involved.

Layer caching keys on the instruction and the digest of what it touches, so ordering the Dockerfile from least to most volatile is what makes incremental builds fast. BuildKit improves on this with a real dependency graph, parallel stages, and cache mounts that persist a package manager's cache across builds without landing in the image.

## The runtime stack

Docker and Podman are the user-facing layer. containerd manages images and supervises lifecycles. runc does the work: it consumes an OCI runtime bundle, sets up namespaces and cgroups, and execs the entrypoint. Every layer here is a defined specification, which is what makes the pieces interchangeable.

Podman's daemonless model runs containers as direct children of the invoking process, which fits systemd supervision and removes a root daemon from the threat model.

## Networking

The default bridge attaches a veth pair to a Linux bridge and NATs outbound traffic through iptables or nftables. Published ports are DNAT rules, so a port that appears open from the host may be firewalled elsewhere entirely.

Host networking removes the namespace and the NAT overhead along with the isolation, which is the usual choice where latency matters, and it means the container's ports are the host's ports.

Containers on a user-defined network resolve each other by name through an embedded DNS server, which is what Compose arranges when services address each other by service name.

## Where it goes wrong

PID 1 has no default signal handlers and does not reap children. An entrypoint ignoring SIGTERM gets ten seconds before SIGKILL, so a shell-form `CMD` leaving the shell as PID 1 means your process never sees the signal. Exec form, or an init like `tini`, fixes both that and zombie accumulation.

The OOM kill above reports as exit 137, and the evidence sits in the kernel log and nowhere the container wrote.

An image built for one architecture will not run on another without emulation. `buildx` with QEMU covers cross-building, at a large performance cost on the emulated path.

Clock, entropy and the kernel are shared. A container cannot load a module, cannot change sysctls outside the namespaced set, and sees the host kernel version, which is what separates this from virtualisation.

## Reading

- [OCI image and runtime specifications](https://opencontainers.org/)
- [`namespaces(7)`](https://man7.org/linux/man-pages/man7/namespaces.7.html) and [`cgroups(7)`](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- [BuildKit documentation](https://docs.docker.com/build/buildkit/) for cache mounts and build secrets
